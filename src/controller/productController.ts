import { Request, Response } from "express";
import Product from "../database/models/product.mode";
import Category from "../database/models/category.model";
interface ProductRequest extends Request{
    file? : {
        filename : string
    }
}

class ProductController{
  async  createProduct(req:ProductRequest,res:Response):Promise<void>{
        const {productName,productDescription,productTotalStock,discount,CategoryId} = req.body
     const filename =   req.file ? req.file.filename : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFNLdaXREebZMuoIgvuA28PdM3-E3SyaeUa0asbd52Og&s"
        if(!productName || !productDescription || !productTotalStock  ||!CategoryId){
            res.status(400).json({
                message:"please provide all the information of product"
            })
            return  
    }
    await Product.create({
productName,
productDescription,
productTotalStock,
discount:discount || 0,
CategoryId,
ProductImage : filename
    })
    res.status(200).json({
        message:"Product created successfully"
    })
}
async getAllProducts(req:ProductRequest,res:Response):Promise<void>{
    const datas = await Product.findAll({
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
async getSingleProduct(req:ProductRequest,res:Response):Promise<void>{
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
async deleteProduct(req:ProductRequest,res:Response):Promise<void>{
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
  async updatePrpduct(req:ProductRequest,res:Response):Promise<void>{
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