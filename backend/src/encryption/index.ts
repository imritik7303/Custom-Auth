import crypto from "crypto"

//key => 32byters base 64-> convert to buffer ->env 
//IV => 16 bytes base 64 -> convet into buffer ->dynamic -> ensure that same text does not genearte same ecnryption
import {config } from "dotenv"
config();
const key  = Buffer.from(process.env.ENCRYPTION_KEY! , "base64")
const iv  = crypto.randomBytes(16);
const algo = "aes-256-cbc"


export const encryptData = (data :string) =>{

    const cipher = crypto.createCipheriv(algo, key , iv);
    let encrypted = cipher.update(data , "utf-8" , "hex");
    encrypted += cipher.final("hex");

    return encrypted
}

export const decryptData = (encrypted: string) =>{
     const decripher = crypto.createDecipheriv("algo" , key , iv);
     let decrypted = decripher.update(encrypted,"hex" , "utf-8");
     decrypted += decripher.final("utf-8");

     return decrypted;

}