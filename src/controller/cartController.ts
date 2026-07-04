import { Request, Response } from "express";
import Cart from "../database/models/cart.model";
import Product from "../database/models/product.mode";

interface AuthRequest extends Request{
    user? :{
        id: string
    }
}

class CartController {
    async addToCart(req:AuthRequest,res:Response){
        //userId, productId, quantity
        const userId = req.user?.id
        const {productId, quantity} = req.body
        if(!productId || !quantity){
            res.status(400).json({
                message : "please provide productId, quantity"
            })
            return
        }//check if that item already exit on that user cart-->if uyes -->just qty++/ else insert
     let cartOfUser = await  Cart.findOne({
            where : {
                productId,
                userId
            }
        })
        if(cartOfUser){
            cartOfUser.quantity = cartOfUser.quantity + quantity
            await cartOfUser.save()
        }else{
            await Cart.create({
            userId,
            productId,
            quantity
        })
        }
       res.status(200).json({
        message:"product added to cart"
       })
    }
    async getCartItems(req:AuthRequest,res:Response){
        const userId= req.user?.id
      const cartItems =  await Cart.findAll({
            where:{
                userId
            },
            //esari product ko sabai details aaunxa
            include : [{
                model :Product,
                attributes :["id",'productName',"productPrice",'productImageUrl']
            }]
        })
        if(cartItems.length ===0){
            res.status(404).json({
                message:"no items in cart"
            })
        }
        else{
            res.status(200).json({
                message:'Cart items fetched successfully',
                data : cartItems
            })
        }
    }
    async deleteMyCartItems(req:AuthRequest,res:Response){
        const userId = req.user?.id
        const {productId} = req.params
        //check product exists or not
        const product = await Product.findByPk(productId as string)
        if(!product){
            res.status(404).json({
                message:"no product with that id"
            })
            return;
        }
        await Cart.destroy({
            where:{
                productId,
                userId
            }
        })
        res.status(200).json({
            message: "cart deleted successfully"
        })

    }
    async updateCartItem(req:AuthRequest,res:Response){
        const userId = req.user?.id
        const {productId} = req.params
        const{quantity}= req.body
        if(!quantity){
            res.status(400).json({
                message : "please add quantity"
            })
            return
        }
        const cartItem =await Cart.findOne({
            where:{
                userId,
                productId
            }
        })
        if(!cartItem){
            res.status(404).json({
                message : "prdouct with that id doesnot exist"
            })
        }else{
            cartItem.quantity = quantity
            await cartItem.save()
            res.status(200).json({
                message:"cart Updated"
            })
        }
    }
}

export default new CartController()