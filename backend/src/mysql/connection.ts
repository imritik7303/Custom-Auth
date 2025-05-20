import { Pool , createPool } from "mysql2/promise"
import { CREATE_TABLE_USERS } from "./tables";


let pool:Pool

const connectToDatabse = async()=>{
    try {
        pool = createPool({
            port : +process!.env!.MYSQL_PORT!,
            host: process.env.MYSQL_HOST,
            user :process.env.MYSQL_USER, 
            password :process.env.MYSQL_PASSWORD,
            database : process.env.MYSQL_DATABASE
        })
        await pool.getConnection();
        console.log("connected to MYSQL")
        await pool.execute(CREATE_TABLE_USERS);
        console.log("users table created");
        
        

    } catch (error) {
        console.log("error connecting to database" , error);
        throw error;  
    }
}

export {connectToDatabse ,pool}