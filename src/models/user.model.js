import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
    {
        username :{
            type :String,
            required : true,
            lowercase : true,
            unique : true,
            trim : true,
            index :true,

        },

        email:{
            type : String,
            required : true,
            lowercase : true,
            unique : true,
            trim : true,
        },

        fullName : {
            type : String,
            required : true,
            trim : true,
            index : true,
        },

        avatar : {
            type : String, // cloudinary url :- it store images,videos,files and provide url or links
            required : true,
        },

        coverImage : {
            type : String,
        },

        watchHistory : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video",
        },

        password : {
            type : String,
            required : [true,"Password is nust be required"],
        },

        refreshToken : {
            type : String,
        
        },
    },{timestamps:true}
);


//to ecrypt the password
userSchema.pre("save",async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
})


// to match the password and encrypt password
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email: this.email,
            username : this.username,
            fullName : this.fullName

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}


export const User = mongoose.model("User",userSchema)