import dotenv from "dotenv";
import { cleanEnv, num, str } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  PORT: num({ default: 3001 }),
  MONGO_URI: str({ desc: "Mongo Uri not found" }),
  CLIENT_ID: str({ desc: "Google client id not found" }),
  CLIENT_SECRET: str({ desc: "Google client secret not found" }),
  REDIRECT_URI: str({ desc: "Google redirect uri not found" }),
  REFRESH_TOKEN: str({ desc: "Google refresh token not found" }),
  EMAIL_USER: str({ desc: "Email user not found" }),
  BASE_URL: str({ desc: "Base url user not found" }),
  JWT_SECRET: str(),
  FRONTEND_BASE_URL: str(),
});
