import { Request, Response } from "express";
import Product from "../database/models/product.mode";
import Category from "../database/models/category.model";
// interface ProductRequest extends Request{
//     file? : {
//         filename : string
//     }
// }

class ProductController{
  async  createProduct(req:Request,res:Response):Promise<void>{
        const {productName,productDescription,productTotalStock,discount,CategoryId,productPrice} = req.body
     const filename =   req.file ? req.file.filename : "anish.jpg"
        if(!productName || !productDescription || !productTotalStock  ||!CategoryId || !productPrice ){
            res.status(400).json({
                message:"please provide all the information of product"
            })
            return  
    }
  const product =  await Product.create({
productName,
productDescription,
productTotalStock,
discount:discount || 0,
CategoryId:CategoryId,
productPrice,
productImage : filename,

    })
    res.status(200).json({
        message:"Product created successfully",data:product
    })
}
async getAllProducts(req:Request,res:Response):Promise<void>{
    const datas = await Product.findAll({
        include : [
            {
                model : Category,
                attributes :["id","categoryName"]
            }
        ]
    })
    res.status(200).json({
        message: " Product fetched successfully",
        data : datas
    })

}
async getSingleProduct(req:Request,res:Response):Promise<void>{
    const {id} = req.params
    const datas = await Product.findAll({
        where :{
            id : id
        },
        include : [
            {
                model : Category
            }
        ]
    })
    res.status(200).json({
        message: " Product fetched successfully",
        data : datas
    })

}
async deleteProduct(req:Request,res:Response):Promise<void>{
    const {id} = req.params
    const datas = await Product.findAll({
        where : {
            id :id
        }
    })
    if(datas.length === 0){
        res.status(404).json({
            message : "Product not found"
        })
    }
     await Product.destroy({
        where :{
            id : id
        }
    })
    res.status(200).json({
        message : "product delted succesfuuly"
    })
}
  async updatePrpduct(req:Request,res:Response):Promise<void>{
        const {id} = req.params
        
    
    const datas = await Category.findAll({
        where:{
            id : id
        }
    })
    // const data = await Category.findByPk(id)
    if(datas.length===0){
        res.status(400).json({
            message:"no product with that id"
        })
    }
    else{
        await Category.update({
            Product:Product
        },
    {
        where:{
            id
        }
    })
    res.status(200).json({
        message:"prodcut updated successfully"
    })
    }
    }

}

export default new ProductController