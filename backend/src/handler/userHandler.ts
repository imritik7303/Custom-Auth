import { Request, Response } from "express";
import { pool } from "../mysql/connection";
import { GET_USER_BY_EMAIL, GET_USER_BY_ID } from "../mysql/queries";
import { INESRT_USER_STATEMENT } from "../mysql/mutation";
import bcrypt from "bcrypt";
import { generateJWTToken, saveRefrehToken} from "../token/jwtTokenManager";
import { encryptData } from "../encryption";

// function to get by any value id or email

const getUserBy = async (by: "email" | "id", value: string) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      by === "id" ? GET_USER_BY_ID : GET_USER_BY_EMAIL,
      [value]
    );

    //@ts-ignore
    const user = result[0][0];
    console.log("user Retrieved", user);
    return user;
  } catch (error) {
    console.log("Error occured while retrieving", error);
    throw error;
  }
};



//setting the cookies
export const setCookies = (accessToken:string, refreshToken:string, res:Response) =>{

  res.clearCookie("access_token",{domain:"localhost" , 
   httpOnly:true , 
   path:"/",
   });
  res.clearCookie("refresh_token",{domain:"localhost" , 
    httpOnly:true , 
    path:"/" 
     });
   
  //creating expiry dates for the cookies   
   const expiryAccessToken = new Date(new Date().getTime() + 60 * 60 * 1000)
   const expiryRefershToken = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)

   res.cookie("access_token",accessToken,{
    domain:"localhost",
    httpOnly:true,
    path:"/",
    expires : expiryAccessToken,
    sameSite:"lax"
   })  

   
   res.cookie("refresh_token",refreshToken,{
    domain:"localhost",
    httpOnly:true,
    path:"/",
    expires : expiryRefershToken,
    sameSite:"lax"
   })  
   console.log("cookie set")

   return;
}

//function set auth token

const setAuthTokens = async (id:string , email:string , res : Response) =>{
    
  try {
    const accessToken =  generateJWTToken(id,email,"access");
    const refreshToken = generateJWTToken(id,email,"refresh");
    const ecryptedToken = encryptData(refreshToken)
    await saveRefrehToken(refreshToken , ecryptedToken);
    console.log("returning from saving token");
    
    setCookies(accessToken,ecryptedToken, res )
  } catch (error) {
    console.log("Error while setting auth token");
    throw error;
  }
    
}




// handlers 

const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        message: "Invalid User id",
      });
    }

    const user = await getUserBy("id", id);
    if (!user) {
      console.log("user not found");
      return res.status(401).json({
        messgae: "User not found",
      });
    }
    return res.status(200).json({ message: "user retrieved", user: user });
  } catch (error) {
    console.log("Error occured", error);
    res.status(500).json({ message: "Unexpected erroe occured" });
    throw error;
  }
};


const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(422).json({
        message: "data missing",
      });
    }
    //checking if user already exist
    const user = await getUserBy("email", email);
    if (user) {
      console.log("user already exist");

      return res.status(401).json({
        messgae: `user already exist with id ${user.id}`,
      });
    }

    //craeting the new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const conn = await pool.getConnection();
    const result = await conn.query(INESRT_USER_STATEMENT, [
      name,
      email,
      hashedPassword,
    ]);
    //@ts-ignore
    const insertId = result[0].insertId as number
    console.log("user Inserted", result[0]);
    await setAuthTokens(String(insertId),email ,res);

    return res.status(200).json({ message: "user created", user: result[0] });

  } catch (error) {
    console.log("Error occured", error);
    res.status(500).json({ message: "Unexpected erroe occured" });
    throw error;
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email , password } = req.body;
    if (!email || !password) {
      return res.status(422).json({
        message: "data missing",
      });
    }

    //checking if user exist or not with given email
    const user = await getUserBy("email", email);
    if (!user) {
      console.log("no user found");

      return res.status(401).json({
        message: "No user found",
      });
    }

    //matching the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    //password matched

    //settoken -> jwt
    await setAuthTokens(String(user.id), email ,res);

    return res.status(200).json({message :"user logged in", user})
  } catch (error) {
    console.log("Error occured", error);
    res.status(500).json({ message: "Unexpected erroe occured" });
    throw error;
  }
};
export { getUser, registerUser, loginUser };
