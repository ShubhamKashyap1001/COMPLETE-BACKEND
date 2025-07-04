import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import router from "../routes/user.routes.js";



const registerUser = asyncHandler(async (req,res) => {
    // res.status(200).json({
    //     message : "chai aur code",
    // })

    //get user details from frontend
    //validation - not empty (valid email , not empty)
    //check if user already exists : username , email
    //check for avatak and coverImages, check for image
    //upload them to cloudinary , avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for creation
    //return res 

    const {fullName,email,username,password} = req.body
    console.log("fullName :", fullName)
    console.log("email : ",email);

    if(
        [fullName , email, username, password].some((field) => 
            field?.trim() === "")
    ){
        console.log("field :",field);
        
        throw new ApiError(400,"All fields are required")
    }

    //to check '@' in email

//     // Check if the email contains '@'
//     if (email.includes('@')) {
//         return true;
//     } else {
//         return false;
//     }


    const existedUser = await User.findOne(
        {
            $or : [{username} , {email}]        //$or is a MongoDB operator used to query documents that match at least one of the given conditions.
        }
    )

    if(existedUser){
        throw new ApiError(409,"User with email or email already existed")
    }

    const avatarLocalPath = req.files?.avatar[0].path;
    //const coverImageLocalPath = req.files?.coverImage[0].path;

    //classical method

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    
    

    if(!avatarLocalPath){
        throw new ApiError (400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    console.log("Avatar local patha :",avatarLocalPath);
    console.log("coverImageLocalPath :",coverImageLocalPath);
    console.log("Avatar :" ,avatar);
    console.log("req.files:", req.files);

//     console.log(req.files); // helpful for debugging
//     if (!req.files || !req.files.avatar) {
//         throw new Error("Avatar file is Required");
// }

    

    if (!avatar) {
        throw new ApiError(400, "Avatar file is Required");
        console.log("Avatar is required");
        
     }


    const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    //mongoDB  haar entry ke sath ek id define kar deta hai ,
    const createdUser =  await User.findById(user._id).select(
        "-password -refreshToken"
    )

    console.log("createdUser : ", createdUser);
    

    if(!createdUser){
        console.log(createdUser);
        
        throw new ApiError(500, "Something went wrong during user registration.")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Successfully")
    )

})  

export { registerUser }