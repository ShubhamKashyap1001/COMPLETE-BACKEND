import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
    {
        videoFile : {
            type : String,
            required : true,
        },

        thumbnail : {
            type : String , // cloudinary url
            required : true,
        },

        title : {
            type : String,
            required : true,
        },

        description : {
            type : String,
            reuired : true,
        },

        duration : {
            type : Number,  //cloudinary url
            required : true,
        },

        view :{
            type : Number,
            default : 0,

        },

        isPublished : {
            type : Boolean,
            default : true,
        },

        owner : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "USer",
        },
    },{timestamps:true}
);

videoSchema.plugin(mongooseAggregatePaginate)


export const Video = mongoose.model("Video",videoSchema)