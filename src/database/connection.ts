import { Sequelize } from "sequelize-typescript";
import envConfig from "../config/config.ts";

const sequelize =new Sequelize(envConfig.connectionString as string)

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

sequelize.sync({force:true})
.then(()=>{
console.log("migragted success")
})


export default sequelize