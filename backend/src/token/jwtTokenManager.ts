import jwt from "jsonwebtoken"
import { setCache } from "../redis/actions";
import { generateRedisKey, generateTTL } from "../utils/helpers";



export const generateJWTToken =  (id:string , email:string , tokenType : "access" | "refresh") => {
  const token = jwt.sign({id,email},process.env.JWT_SECRET_KEY!,{
    expiresIn : tokenType === "access" ? "1h" : "7d",
  })

  return token ; 
}


export const saveRefrehToken = async (token:string , encryptedToken : string)=>{
    const decodedData = jwt.decode(token , {json :true});
    if(!decodedData){
        throw new Error("error while decoding")
    }
    const key = generateRedisKey(decodedData.id);
    const TTL = generateTTL(decodedData.exp!)
    try {
      await setCache(key , encryptedToken, TTL);
      console.log("saved refresh token ");
      
    } catch (error) {
        console.log("Error occured while saving the refresh token", error);
        throw error;
        
    }
}

export const verifyJWT = (token:string )=>{
   return new Promise((resolve ,reject)=>{
     jwt.verify(token,process.env.JWT_SECRET_KEY!,(err,payload)=>{
      if(err){
        console.log("could not verify token");
        reject(err);
      }else{
        console.log("token verification success");
        resolve(payload);
      }
     })
   })
}