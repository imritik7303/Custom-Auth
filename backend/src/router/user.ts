//@ts-nocheck
import { Router } from "express";
import {  getUser, loginUser, registerUser } from "../handler/userHandler";

const userRouter = Router();
//api/v1/auth/user 

//@ts-ignore
userRouter.get("/:id", getUser);
//@ts-ignore
userRouter.post("/login", loginUser)
userRouter.post("/register" , registerUser)



export default userRouter;
