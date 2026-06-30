import { Response } from "express";

import sendResponse from "./sendResponse";


const checkOtpExpiration = (res:Response, otpGeneratedTime:string, thresholdTime:number)=>{
    const currentTime = Date.now()
    if(currentTime - parseInt(otpGeneratedTime)<=thresholdTime){
        //otp expires vako xaina
        sendResponse(res,200,"Valid Otp, now you can reset password")
    }else{
        //otp expires vayo
        sendResponse(res,400,"Otp expired, sorry try again")
    }
}

export default checkOtpExpiration