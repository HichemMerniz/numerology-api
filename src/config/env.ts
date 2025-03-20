import dotenv from "dotenv";
dotenv.config();

export const config = {
  jwtSecret: process.env.JWT_SECRET || "defaultSecret",
  tokenExpiration: process.env.TOKEN_EXPIRATION || "1d",
};