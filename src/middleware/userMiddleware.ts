
import { NextFunction, Request,Response } from "express";
import  jwt  from "jsonwebtoken";
import envConfig from "../config/config";
import user from "../database/models/user.model";

export enum Role{
  Admin = 'admin',
  Customer = 'customer'
}
interface IExtendedRequest extends Request{
    user? : {
        userName : string, 
        email : string, 
        role : string, 
        password : string, 
        id : string

    }
}
class UserMiddleware{
    async isUserLoggedIn(req:IExtendedRequest,res:Response,next:NextFunction):Promise<void>{
        
        //first maa token receive
      const token =  req.headers.authorization
      if(!token){
        res.status(403).json({
            message:"token must be provided"
        })
        return
      }

        // validate token
      jwt.verify(token,envConfig.jwtsecretkey as string, async(err, result:any)=>{
        if(err){
            res.status(403).json({
                message:"invalid token"
                
            })
            console.log("error")
        }else{

            //lgoin vayepaxi category maa add category hunxa
          
           const userData= await user.findByPk(result.userId)
           if(!userData){
            res.status(400).json({
              message: " no user with that userId"
              
            })
            return
           }
            // req.userId = result.userId
            req.user = userData
            next()
        }
      } )
    }
    accessTo(...roles:Role[]){
      return (req:IExtendedRequest,res:Response,next:NextFunction)=>{
        let userRole = req.user?.role as Role
//         console.log(req.user);
// console.log(req.user?.role);
// console.log(roles);
        if(!roles.includes(userRole)){
          res.status(403).json({
            message:"You don't have permission !!!"
          })
          return
        }
        next()
      }
    }
}

export default new UserMiddleware()