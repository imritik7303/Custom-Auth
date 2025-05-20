import express, { urlencoded } from "express";
import helmet from "helmet";
import morgan from "morgan"
import appRouter from "./router";
import cookieParser from "cookie-parser"
const app = express();

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(helmet());
app.use(morgan("dev"))


//logging the request coming to backend
app.use((req,res,next)=>{
    console.log("request recieved");
    console.log("reURL", req.baseUrl + req.url);
    console.log(JSON.stringify(req.headers));
    next();  
})

app.use("/api/v1/auth" , appRouter);


export default app;