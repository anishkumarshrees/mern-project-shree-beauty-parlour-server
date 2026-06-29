
import   { config }  from "dotenv";
import user from "../database/models/user.model.ts";
config()
const envConfig = {
    port: process.env.PORT,
    connectionString : process.env.CONNECTION_STRING,
    // models:[user]
    jwtsecretkey : process.env.JWT_SECRET_KEY,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN


}

export default envConfig