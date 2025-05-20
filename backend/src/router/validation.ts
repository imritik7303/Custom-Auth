import { Router } from "express";
import { validateAuth } from "../middleware/auth";

const validationRouter = Router();

validationRouter.put("/tokens" , validateAuth)
export default validationRouter;