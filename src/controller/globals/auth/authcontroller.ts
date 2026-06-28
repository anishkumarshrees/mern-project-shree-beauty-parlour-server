//features- login/register/forget password/logout/reset pw/ otp

/*
Register-incoming data
username,email,pw
processing/checking - email valid, compulsary data aauna paryo
db query - table maa insert garni kura
*/ 

import type { Request ,Response } from "express";
import user from "../../../database/models/user.model";
import  bcrypt  from "bcrypt";
//functional bbased code
// const registerUser =async  (req:Request,res:Response) =>{
// //  const userName=  req.body.username
// //  const password =req.body.password
// //  const email = req.body.email
//  const {userName,password,email}=req.body

//  if(!userName || !password || !email){
//     res.status(400).json({
//         message : "please provide username, password, email"
//     })
//  }else{
//     //insert into users table
//    await user.create({
//         userName : userName,
//         password:password,
//         email:email
//     })
//     res.status(200).json({
//         message:"user registered successfully"
//     })
//  }
// }
//oop based code
class AuthController{
  static async registerUser(req:Request, res:Response){
    const {userName, password, email}=req.body

 if(!userName || !password || !email){
    res.status(400).json({
        message : "please provide username, password, email"
    })
 }else{
    //insert into users table
   await user.create({
        userName : userName,
        //.hashsync(kunlairakhni,kati strong)
        password:bcrypt.hashSync(password,12),
        email:email
    })
    res.status(200).json({
        message:"user registered successfully"
    })
 }
}
}

export  {AuthController}