import envConfig from "./config/config"
import user from "./database/models/user.model"
import bcrypt from 'bcrypt'

const adminSeeder=async ()=>{
 const [data]  = await user.findAll({
        where:{
            email: envConfig.adminEmail
        }
    })
    if(!data){
        await user.create({
userName:envConfig.adminUerName,
password:bcrypt.hashSync(envConfig.adminPassword as string,8),
email:envConfig.adminEmail,
role:"admin"
})
console.log("admin seeded")
    }
    else{
        console.log("admin already seeded")
    }

}

export default adminSeeder