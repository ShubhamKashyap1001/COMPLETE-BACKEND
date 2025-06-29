// import mongoose from "mongoose"

// import dotenv from "dotenv"

// dotenv.config({

// })

// import {DB_NAME} from "./constants.js"

// import express from "express"
// const app = express();

// (async () => {
//     try{
//         console.log(process.env.MONGODB_URI)
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         console.log("DB CONNECTED");
//         app.on("error",(error) =>{
//             console.log("ERROR: ",error);
//             throw error;
//         });

//         app.listen(process.env.PORT,() =>{
//             console.log(`App is listening On port ${process.env.PORT}`);
            
//         } )
//     }catch(error){
//         console.log("ERROR : " ,error);
//         throw error;
//     }
// })()

import dotenv from "dotenv"

import mongoose from "mongoose"

import connectDB from "./db/index.js"

dotenv.config({
    path : "./env"
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`Server is Running at port : ${process.env.PORT}`);
        
    })
})
.catch((error) => {
    console.log(" MongoDB Connection Failed !! ", error);
})