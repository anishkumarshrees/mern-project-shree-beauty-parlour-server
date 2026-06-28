
import   { config }  from "dotenv";
import user from "../models/user.model.ts";
config()
const envConfig = {
    port: process.env.PORT,
    connectionString:process.env.CONNECTION_STRING
    // models:[user]

}

export default envConfig