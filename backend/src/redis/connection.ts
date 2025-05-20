import { createClient} from "redis"

const redisClient = createClient();
const intializeRedis = async() =>{
  try {
    redisClient.on("error" , (err)=>{
        console.log("Error event occured" , err);
        
    })
    await  redisClient.connect();
    console.log("Redis connected successful");
    
  } catch (error) {
    console.log("Error intializing Redis", error);
    throw error
    
  }
}

export {redisClient , intializeRedis}