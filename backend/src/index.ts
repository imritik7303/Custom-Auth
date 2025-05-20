import app from "./app"
import {config} from "dotenv"
import { connectToDatabse } from "./mysql/connection";
import { intializeRedis } from "./redis/connection";

config(); 

const init = async ()=>{
  try {
    await connectToDatabse();
    await intializeRedis()
    const PORT = process.env.PORT || 5000 ; 
    app.listen(PORT , ()=>{
      console.log("application started at port " , PORT)
    })
  } catch (error) {
    console.log("app intialization error" , error);
    process.exit(1);
  }
    
}

init();