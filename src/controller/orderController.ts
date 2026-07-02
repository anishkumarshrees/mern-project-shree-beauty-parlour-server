import { Request, Response } from "express";
import Order from "../database/models/order.model";
import OrderDetails from "../database/models/orderDetails";
import user from "../database/models/user.model";
import { PaymentMethod } from "../globals/types";
import Payment from "../database/models/payment.model";

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
        if(paymentMethod == PaymentMethod.COD){
          await  Payment.create({
                orderId: orderData.id,
                paymentMethod: paymentMethod
            })

        }else if(paymentMethod == PaymentMethod.Khalti ){
            //khlati logic
        }else{
            //baki esewa xa tesko logic
        }
        res.status(200).json({
            message : "order created successfull" 
        })
    }
}


export default new OrderController()