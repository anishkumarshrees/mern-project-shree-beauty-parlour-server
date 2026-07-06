//features- login/register/forget password/logout/reset pw/ otp

/*
Register-incoming data
username,email,pw
processing/checking - email valid, compulsary data aauna paryo
db query - table maa insert garni kura
*/ 

import type { Request ,Response } from "express";

import  bcrypt  from "bcrypt";
import generateToken from "../../../services/generateToken";
import generateOtp from "../../../services/generateOtp";
import sendMail from "../../../services/sendMail";
import findData from "../../../services/findData";
import checkOtpExpiration from "../../../services/checkOtpExpiration";
import sendResponse from "../../../services/sendResponse";
import user from "../../../database/models/user.model";
import envConfig from "../../../config/config";
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
    const {userName, password, email, role}=req.body

 if(!userName || !password || !email){
    res.status(400).json({
        message : "please provide username, password, email"
    })
    return
 }
  const [data]  = await user.findAll({
        where:{
            email: email
        }
    })
    if(data){
     res.status(400).json({
            message: "please try again later"
        })
        return
    }

    //insert into users table
  const User= await user.create({
        userName : userName,
        //.hashsync(kunlairakhni,kati strong)
        password:bcrypt.hashSync(password,12),
        email:email,
        role:role
    })
    await sendMail({
        to:email,
        subject : " Registred successfullly",
        text:"welcome to our beauty parlour"
    })
    res.status(200).json({
        message:"user registered successfully",
        data : User
    })
 
}
static async login(req:Request,res:Response){
    //first maa user accept garna paryo
    // accept incoming data --> email,password
    const {email, password}=req.body
    if(!email || !password){
        res.status(400).json({
            message:"please rovide all imformation"
        })
        return
    }

    //user xa ki nai herna paryo
    //first maa check email exist or not 
 const [data] =  await user.findAll({
        where:{
            email : email
        }
    })
   //if not exist
    if(!data){
        res.status(400).json({
            message:"no user with that email 🥲"
        })
    } //if exist check password
    else{
      const isEqual=  bcrypt.compareSync(password,data.password)
        if(!isEqual){
            res.status(400).json({
                messgae:"invalid password"
            })
        }
        else{
          const token =  generateToken(data.id)
            res.status(200).json({
                message : "login successfully",
                token : token
            })
        }
    }
    //if pw milyo vani-> token generate(jwt)
}
static async handleForgotPassword(req:Request,res:Response){
const {email}=req.body
    if(!email){
         res.status(400).json({
    message : "pleasve provide email"})
    return
         }
    const [data]= await user.findAll({
        where:{
            email : email
        }
    })
    if(!data){
        return res.status(404).json({
            email : "email not registred"
        })
        return
    }
    //email xa vani otp pathauna paryo(generat otp and sent to mail)
    const otp = generateOtp()
   await sendMail({
   
        to:email,
        subject:"OTP COde",
        text:`You just request to reset password. Here is your otp , ${otp}`
    })
    data.otp = otp.toString()
    data.optGeneratedTime = Date.now().toString()
    await data.save()
    res.status(200).json({
        message:"password reset otp token"
    })

}
static async verifyOtp(req:Request,res:Response){
    const {otp,email}=req.body
    if(!otp || !email){
        sendResponse(res,400,"please provide opt and email")
        return
    }
    const User = await findData(user,email)
    if(!user){
        sendResponse(res,400,"no user with that email")
        return
    }
    //otp verification
    const [data] = await user.findAll({
        where:{
            otp,
            email
        }
    })
    if(!data){
        sendResponse(res,400,'Invalid OTP')
    }
    const otpGeneratedTime = data?.optGeneratedTime
    checkOtpExpiration(res,otpGeneratedTime as string,120000)
}

static async resetPassword(req:Request,res:Response){
    const {newPassword,confirmPassword,email}= req.body
    if(!newPassword || !confirmPassword || !email){
        sendResponse(res,400,"please provide newPassword, confirmPassword, email, otp")
        return
    }
    if(newPassword !== confirmPassword){
        sendResponse(res,400,"newPassword and ConfirmPassowrd must be same")
        return
    }
    const User = await findData(user,email)
    if(!User){
        sendResponse(res,404,"no email with that user")
    }
    User.password = bcrypt.hashSync(newPassword,12)
    await User.save()
    sendResponse(res,200,"password reset successfully")
}
static async fetchUsers(req:Request,res:Response){
    const Users= await user.findAll({
        attributes : ["id","userName","email"]
    })
    res.status(200).json({
        message:"user fetched successfully",
        data : Users
    })
}
static async deleteUser(req:Request,res:Response){
    const {id} = req.params
    if(!id){
        res.status(400).json({
            message: "please provide Id"
        })
        return
    }
    await user.destroy({
        where:{
            id
        }
    })
    res.status(200).json({
        message:  "user deleted successfully"
    })
}
}

export  {AuthController}