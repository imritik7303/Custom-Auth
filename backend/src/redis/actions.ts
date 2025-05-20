import { redisClient } from "./connection";


const setCache = async (key:string , data:string , EX: number) =>{
    try {
        await redisClient.set(key , data ,{EX});
        console.log("Redis : SET-cache " , key , "value" , data);

    } catch (error) {
        console.log("Error while setting redis data", error);
        throw error;
    }
}


const getCache = async (key:string) =>{
    try {
        const value = await redisClient.get(key);
        console.log("Redis : GET-cache " , value);
        return value
    } catch (error) {
        console.log("Error while getting redis data", error);
        throw error;
    }
}

export {getCache , setCache}