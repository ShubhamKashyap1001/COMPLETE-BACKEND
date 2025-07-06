import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import router from "../routes/user.routes.js";


const generateAccessAndRefreshToken = async(userId) => {
    try{
        const user = await User.findOne(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}


    }catch(error){
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}         // internal method 



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


const loginUser = asyncHandler(async (req,res) => {

    //req body -> data
    //username or email and password
    //find the user
    //password check
    //access and refresh token
    //send cookie

    const {email,username,password} = req.body

   if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or : [{username} , {email}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist")
    }
    

    const isPasswordValid = await user.isPasswordCorrect(password)

    console.log(isPasswordValid);
    
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //cookies
    const options = {
        httpOnly :true,
        secure : true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser,accessToken,refreshToken            // here , we send access and refresh token because of user store it at local environment or for mobileApp 
            },
            "User Logged In Successfully"
        )
    )
})


//yaha pe humlog ne middleware ko define isliye kiya kyuki hum log ke pass logout karne ke liye koi bhi
// referance nhi the isliye humlog ko middleware define karke voha se token nikale 
//logout karne ke liye humlog ko cookie ko expire karna hoga aur access token aur refreah token bhi hatata hoga
//humlog logout nhi kar sakte the 

const LogoutUser = asyncHandler(async(req,res) =>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined        // this removes the field from document
            }
        },
        {
            new : true,
        }
    )

    const options = {
        httpOnly : true,
        secure : true,
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out"))
})


const refreshAccessToken = asyncHandler(async(req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized Request")
    }

    try{
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)
        //"Find and return the user document from the database whose _id matches the _id property inside decodedToken."
        //decodedToken?._id	 -> Uses optional chaining (?.) to safely access _id from decodedToken —,
        // if decodedToken is null or undefined, it won’t throw an error, just returns undefined.

        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh Token is expired or used")
        }

        const options = {
            httpOnly : true,
            secure : true
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json (
            new ApiResponse(
                200,
                {accessToken, refreshToken : newRefreshToken},
                "ACCESS TOKEN REFRESHED"
            )
        )

    }catch(error){
        throw new ApiError(401, error?.message || "Invalid refresh Token")
    }
})

const changeCurrentPassword = asyncHandler(async(req,res) => {
    const {oldPassword ,confirmPassword, newPassword} = req.body

    if(newPassword !== confirmPassword){
        throw new ApiError("Invalid password")
    }

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password changed Successfully"
        )
    )
})

const getCurrentUser = asyncHandler(async(req,res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200,req.user,"Current user fetched successfully")
    )
})

const updateAccountDetails = asyncHandler(async(req,res) => {

    const {fullName,email} = req.body

    if(!fullName || !email){
        throw new ApiError(401,"ALL fields are required")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName : fullName,
                email : email,

            }
        },
        {
            new : true
        }
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Account details update successfully"))
})

const updateUserAvatar = asyncHandler(async(req,res) => {
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400,"Error while uploading on the Avatar Image")
    }

    const user =  await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {
            new : true
        }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"Avatar Image updated successfully")
    )
})

const updateUserCoverImage = asyncHandler(async(req,res) => {
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover Image is not found");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)        //yaha cover image mil gyi hogi

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading on cover image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                coverImage : coverImage.url
            }
        },
        {
            new : true,
        }
    ).select("-password")

    return res.status(200)
    .json(
        new ApiResponse(200,user,"Cover Image Update successfully..")
    )
})

export { 
    registerUser,
    loginUser,
    LogoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}