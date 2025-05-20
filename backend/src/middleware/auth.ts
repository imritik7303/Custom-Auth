import { Request, Response } from "express";
import { validateAcessToken, validateRefreshToken } from "../utils/helpers";
import { generateJWTToken, saveRefrehToken } from "../token/jwtTokenManager";
import { encryptData } from "../encryption";
import { setCookies } from "../handler/userHandler";

export const validateAuth = async (req: Request, res: Response) => {
  //@ts-ignore
  const [access, refresh] = req.headers.authorization?.split(" ,");
  const acessToken = access && access.split("=")[1];
  const refreshToken = refresh.split("=")[1];

  console.log(acessToken, refreshToken);

  const isAcessTokenValid = await validateAcessToken(acessToken);

  const decodedRefreshToken = await validateRefreshToken(refreshToken);

  if (isAcessTokenValid && decodedRefreshToken) {
    console.log("acess token and refresh token valid");
    return res.status(200).json({
      messge: "Authorized",
      success: "true",
    });
  } else if (!isAcessTokenValid && decodedRefreshToken) {
    //generate the token
    const newAcessToken = generateJWTToken(
      decodedRefreshToken.id!,
      decodedRefreshToken.email!,
      "access"
    );
    const newRefreshToken = generateJWTToken(
      decodedRefreshToken.id!,
      decodedRefreshToken.email!,
      "refresh"
    );

    const newEncryptedRefreshToken = encryptData(newRefreshToken);

    saveRefrehToken(newRefreshToken, newEncryptedRefreshToken);

    setCookies(newAcessToken, newEncryptedRefreshToken, res);
    return res.status(200).json({
      messge: "Authorized",
      success: "true",
    });
  } else {
    res.status(400).json({ 
        message: "not Authorized", 
        success: "false" });
  }

  return res.json({ success: "true" });
};
