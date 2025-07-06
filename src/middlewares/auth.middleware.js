import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


//yaha pe hum jwt ko verify isliye karaye hai kyuki login ke time hum user ko accessToken and refresToken de diye the
export const verifyJWT = asyncHandler(async(req, _,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        console.log(token);
        
        if(!token){
            throw new ApiError(401,"Unauthorized Request")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            //FOCUS-IMPORTANT(DISCUSS ABOUT FRONTEND)
            throw new ApiError(401,"Invalid Access Token")
        }
    
        req.user = user
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})