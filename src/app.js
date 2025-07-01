import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import userRouter from './routes/user.routes.js'

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
//app.use("/api/v1/users", userRouter)
app.use("/api/v1/users", userRouter)


// In Express (Node.js)
// app.get('/api/v1/users/register', (req, res) => {
//     // Handle user registration
//     res.send("User registered");
// });

app.get('/login',(req,res) => {
    res.send("login")
})


// http://localhost:8000/api/v1/users/register


export { app }