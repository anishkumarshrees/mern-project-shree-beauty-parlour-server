import jwt from "jsonwebtoken";
import user from "../database/models/user.model";
import envConfig from "../config/config";
import { StringValue } from "ms";

const generateToken = (userData: user) => {

  const token = jwt.sign(
    {
      userId: userData.id,
      role: userData.role
    },
    envConfig.jwtsecretkey as string,
    {
      expiresIn: envConfig.jwtExpiresIn as StringValue
    }
  );

  return token;
};

export default generateToken;