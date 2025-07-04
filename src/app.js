import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import userRouter from './routes/user.routes.js'
import connectDB from "./db/index.js"

connectDB()

const app = express();
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true,
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended: true , limit : "16kb"}))
app.use(express.static("public"))

app.use(cookieParser())


//routes import 
//import userRouter from "./routes/user.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter)


app.get('/login',(req,res) => {
    res.send("login")
})
app.listen(process.env.PORT,()=>{
    console.log("Server is running")
})


// http://localhost:8000/api/v1/users/register


export { app }