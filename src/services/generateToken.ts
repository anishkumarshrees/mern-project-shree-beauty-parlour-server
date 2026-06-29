import  jwt  from "jsonwebtoken"
import user from "../database/models/user.model"
import envConfig from "../config/config"
import { StringValue } from "ms"

const generateToken=(userId:string)=>{
//token generation using jwt
const token = jwt.sign({userId: userId }, envConfig.jwtsecretkey as string, { expiresIn : envConfig.jwtExpiresIn as string | number as StringValue })
return token
}

export default generateToken