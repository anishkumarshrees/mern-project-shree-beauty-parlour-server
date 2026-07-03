import { Request, response, Response } from "express";
import Order from "../database/models/order.model";
import OrderDetails from "../database/models/orderDetails";
import user from "../database/models/user.model";
import { PaymentMethod, PaymentStatus } from "../globals/types";
import Payment from "../database/models/payment.model";
import axios from "axios";
import Product from "../database/models/product.mode";

interface IProduct{
    productId: string,
    productQty:string
}

interface OrderRequest extends Request{
user?:{
    id:string
}
}


class OrderController{
    async createOrder(req:OrderRequest,res : Response){
      const userId=  req.user?.id
        const {phoneNumber, shippingAddress, totalAmount,paymentMethod} = req.body
        const products:IProduct[] = req.body.products
        if(!phoneNumber || !shippingAddress || !totalAmount || products.length === 0){
            res.status(400).json({
                message : "please provide all the required fields"
            })
            return
        }
        //for order
        console.log(userId)
       const orderData= await Order.create({
            phoneNumber,
            shippingAddress,
            totalAmount,
            userId 
        })
        // for orderDetails
         products.forEach(async function(product){
        await OrderDetails.create({
            quantity : product.productQty, 
            productId : product.productId, 
            orderId : orderData.id
        })
    });
        //for payment
        
        const paymentData = await Payment.create({
              
                orderId: orderData.id,
                paymentMethod: paymentMethod
          
    })
         if(paymentMethod == PaymentMethod.Khalti ){
            //khlati logic
            const data = {
                return_url :"http://localhost:5173/",
                website_url : "http://localhost:5173/",
                amount : totalAmount * 100,
                purchase_order_id : orderData.id,
                purchase_order_name :"order_" + orderData.id
            }
         const response = await  axios.post("https://dev.khalti.com/api/v2/epayment/initiate/",data,{
            headers:{
                Authorization : "key 148dc9b6527a4bf2b136a86fd4096346"
            }
          })
          const khaltiResponse = response.data
          paymentData.pidx = khaltiResponse.pidx
          paymentData.save()
          res.status(200).json({
            message : "order created successfull" ,
            url : khaltiResponse.payment_url,
            pidx: khaltiResponse.pidx
        })
          
        

          console.log(response)
        }else if(paymentMethod == PaymentMethod.Esewa){
            //baki esewa xa tesko logic
        }
        else{
            res.status(200).json({
                message:'order created successfully'
            })
        }
        
        
    }
   async verifyTransaction(req:OrderRequest,res:Response):Promise<void>{
    const {pidx} = req.body
    if(!pidx){
        res.status(400).json({
            message:"please provide pidx"
        })
        return
    }
   const response = await axios.post("https://dev.khalti.com/api/v2/epayment/lookup/",{
        pidx : pidx
    },{
        headers:{
            Authorization : "key 148dc9b6527a4bf2b136a86fd4096346"
        }
    })
    const data = response.data 
    if(data.status === "completed"){
        await Payment.update({PaymentStatus: PaymentStatus.Paid},{
            where:{
                pidx : pidx
            }
        })
        res.status(200).json({
            message:"payment verified succesffully"
        })
    }
    else{
        res.status(200).json({
            message:"payment not verified or cancelled"
        })
    }
    }
}


export default new OrderController()