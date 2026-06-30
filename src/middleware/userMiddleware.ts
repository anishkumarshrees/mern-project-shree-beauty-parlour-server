
import { NextFunction, Request,Response } from "express";
import  jwt  from "jsonwebtoken";
import envConfig from "../config/config";
class UserMiddleware{
    async isUserLoggedIn(req:Request,res:Response,next:NextFunction):Promise<void>{
        //first maa token receive
      const token =  req.headers.authorization
      if(!token){
        res.status(403).json({
            message:"token must be provided"
        })
        return
      }

        // validate token
      jwt.verify(token,envConfig.jwtsecretkey as string, async(err, result)=>{
        if(err){
            res.status(403).json({
                message:"invalid token"
            })
        }else{

            //lgoin vayepaxi category maa add category hunxa
            //@ts-ignore
            req.userId = result.userId
            next()
        }
      } )
    }
}

export default new UserMiddleware