import { Request, Response } from "express";
import Order from "../database/models/order.model";

interface IProduct{
    productId: string,
    proudctQty:number
}

class OrderController{
    async createOrder(req:Request,res : Response){
        const {phoneNumber, shippingAdress, totalAmount} = req.body
        const products:IProduct[] = req.body
        if(!phoneNumber || !shippingAdress || !totalAmount || products.length == 0){
            res.status(400).json({
                message : "please provide all the required fields"
            })
            return
        }
        Order.create({
            phoneNumber,
            shippingAdress,
            totalAmount
        })
        
    }
}


export default new OrderController