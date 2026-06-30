import { Sequelize } from "sequelize-typescript";
import envConfig from "../config/config.ts";
import user from "./models/user.model.ts";

const sequelize =new Sequelize(envConfig.connectionString as string,{
     models : [__dirname + '/models']
})

try {
    sequelize.authenticate()
    .then(()=>{
        console.log("pw milyo")
    })
 .catch (err=>{
    ()=>
        console.log("pw milyo")
    
 }) 
} catch (error){
    console.log(error)
}

//migrate garna parxa/push garna parxa
//fore:true garyo vani kei change garda tarw false garda chai change garda chagne hudaina so alter:true le teslai help garxa 
sequelize.sync({force:false , alter:false})
.then(()=>{
console.log("migragted success")
})


export default sequelize