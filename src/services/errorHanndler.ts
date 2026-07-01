import { Request, Response } from "express"
//yo ochai edi kei error aayo vani direct yo error yo file ko yo line maa na vanerw developer side batw internal error ko message dekhauna ko lagi yo function banako ho

const errorHandler=(fn:Function)=>{
    return(req:Request,res:Response)=>{
        fn(req,res).catch((err:Error)=>{
            res.status(500).json({
                message:"Internal error",
                errorMessage : err.message
            })
            return
        })
    }
}

export default errorHandler