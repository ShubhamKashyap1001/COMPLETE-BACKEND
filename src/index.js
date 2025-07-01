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

// import dotenv from "dotenv"

// import mongoose from "mongoose"
// import express from "express"
// import connectDB from "./db/index.js"

// dotenv.config({
//     path : "./.env"
// })

// const app = express();

// connectDB()
//     .then(() => {
//     app.listen(process.env.PORT || 8000 , () => {
//         console.log(`Server is Running at port : ${process.env.PORT}`);
        
//     })
// })
// .catch((error) => {
//     console.log(" MongoDB Connection Failed !! ", error);
// })


//after solving bug in code we notify all where bugs is found

import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";   // ✅ Import express
import connectDB from "./db/index.js"; // Your DB connection function

dotenv.config({
    path: "./.env",         // ✅ Make sure the .env file exists and is correctly named
});

const app = express();      // ✅ Initialize express

// (Optional) Add basic route for testing
app.get("/", (req, res) => {
    res.send("API is working!");
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`✅ Server is running at port: ${process.env.PORT || 8000}`);
        });
    })
    .catch((error) => {
        console.error("❌ MongoDB Connection Failed !! ", error);
    });
