
import { verifyJWT } from "../token/jwtTokenManager";
import { decryptData } from "../encryption";
import { getCache } from "../redis/actions";
type TokenInfo = {
   id:string,
   email:string,
   exp:number,
   iat:number,
}

const generateRedisKey = (userId : string) : string=>{
    return "user-" + userId;
 }
 
const generateTTL = (tokenExp : number) : number=>{
     const currTime  = Math.floor(Date.now()/1000);
     
     const secondToExpire = tokenExp - currTime;
 
     return secondToExpire > 0 ? secondToExpire : 0;
  }
 
const validateAcessToken = async (token:string)=>{
   try {
      const decryptedData = await verifyJWT(token);
      if(decryptedData){
         return true
      }else{
          return false
      }
   } catch (error) {
      console.log("Error while validating access token");
      return false
      
   }
} 

const validateRefreshToken = async (encryptedtoken:string)=>{
   try {
      const jwtToken = decryptData(encryptedtoken);
  const decodedJwtData = await verifyJWT(jwtToken) as TokenInfo | null;
  if(!decodedJwtData){
   console.log("Could not validate refresh token");
   return false;
  }
  const encryptedTokenFromCache = await getCache(generateRedisKey(decodedJwtData.id));

  if(!encryptedTokenFromCache){
   console.log("Token not found in memory");
   return false;
  }

  const decryptedTokenFromCache = decryptData(encryptedTokenFromCache);
  const decodedTokenFromCache = await verifyJWT(decryptedTokenFromCache) as TokenInfo | null;

  if(encryptedTokenFromCache !== encryptedtoken && jwtToken !== decryptedTokenFromCache){
    console.log("Token malfunctioned");
  }
  
  const ttl = generateTTL(decodedTokenFromCache!.exp)
   if(ttl <= 0 ){
      console.log("token expired in memory"); 
      return false
   }

   return {...decodedTokenFromCache}
   } catch (error) {
      console.log("Error while validating refresh token" ,error);
      return false
   }
  
}


export {generateRedisKey  , generateTTL , validateAcessToken , validateRefreshToken}