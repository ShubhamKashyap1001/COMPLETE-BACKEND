import mongoose from "mongoose"

import {DB_NAME} from "../constants.js"

import express from "express"

const connectDB = async () => {
    try{
        const connectionInstances = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`DB CONNECTION SUCCESSFUL !! ${connectionInstances.connection.host}`)
    }catch(error){
        console.log(`DB CONNECTION LOST !! ${error}`)
        process.exit(1);
    }
}

export default connectDB