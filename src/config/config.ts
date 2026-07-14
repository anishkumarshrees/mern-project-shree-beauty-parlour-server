import { config } from "dotenv";
import user from "../database/models/user.model";
config();
import bcrypt from "bcrypt";
const envConfig = {
  port: process.env.PORT,
  connectionString: process.env.CONNECTION_STRING,
  // models:[user]
  jwtsecretkey: process.env.JWT_SECRET_KEY,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  email: process.env.EMAIL,
  emailPassword: process.env.EMAIL_PASSWORD,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  adminUerName: process.env.ADMIN_USER_NAME,
};

export default envConfig;
