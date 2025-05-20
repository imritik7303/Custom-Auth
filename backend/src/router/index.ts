import { Router } from "express";
import userRouter from "./user";
import validationRouter from "./validation";

const appRouter = Router();


appRouter.use("/user" , userRouter);
appRouter.use("/validate" , validationRouter)

export default appRouter;
