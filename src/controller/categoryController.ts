

//caterogry chai 2 ota le complement garna milxa
/*
jastai cateogries maa groceris,foods electornic xa vani
seed garda vayo

edi thulo xa vani 
custom categories garna milyo

delete, fetch , update 
*/

//this code is for seeding puprose if we need to insert automatically in the begining of the project
import { Request, Response } from "express";
import Category from "../database/models/category.model";
class CategoryController{
    categoryData =[
        {
            categoryName:"Sunscream"
        },
        {
            categoryName : "oil"
        },
        {
            categoryName:"powder"
        }
    ]
    async seedCategory():Promise<void>{
        const datas = await Category.findAll()
        if(datas.length === 0){
 await Category.bulkCreate(this.categoryData)
 console.log("categorries seeded successfully")
 
        }else{
            console.log("categories already seeded")
        }
       
    }
    async addCategory(req: Request, res: Response): Promise<void>{
        const {categoryName} = req.body
        if(!categoryName){
            res.status(400).json({
                message:"please provide categoryName"
            })
            return
        }
        await Category.create({
            categoryName
        })
        res.status(200).json({
            message:"category added successfully"
        })
    }
    async getCategories(req:Request,res:Response){
        const data = await Category.findAll()
        res.status(200).json({
            message:"fetched categories",
            data
        })
    }
    async deleteCategory(req:Request,res:Response):Promise<void>{
const {id} = req.params
    if(!id){
        res.status(400).json({
            message: "please provide Id"
        })
        return
    }
    const data = await Category.findAll({
        where:{
            id : id
        }
    })
    // const data = await Category.findByPk(id)
    if(data.length===0){
        res.status(400).json({
            message:"no category with that id"
        })
    }
    await Category.destroy({
        where:{
            id
        }
    })
    res.status(200).json({
        message:  "category deleted successfully"
    })
    }

    async updateCategory(req:Request,res:Response):Promise<void>{
        const {id} = req.params
        const {categoryName}=req.body
    if(!id || !categoryName){
        res.status(400).json({
            message: "please provide Id"
        })
        return
    }
    const data = await Category.findAll({
        where:{
            id : id
        }
    })
    // const data = await Category.findByPk(id)
    if(data.length===0){
        res.status(400).json({
            message:"no category with that id"
        })
    }
    else{
        await Category.update({
            categoryName:categoryName
        },
    {
        where:{
            id
        }
    })
    res.status(200).json({
        message:"categoryName updated successfully"
    })
    }
    }
}


export default new CategoryController

/*

import { Request, Response } from "express";
import Category from "../database/models/category.model";

class CategoryController {

 static   async createCategory(req: Request, res: Response) {
        try {

            const { categoryName } = req.body;

            if (!categoryName) {
                return res.status(400).json({
                    success: false,
                    message: "Category name is required",
                });
            }

            const categoryExists = await Category.findOne({
                where: {
                    categoryName,
                },
            });

            if (categoryExists) {
                return res.status(409).json({
                    success: false,
                    message: "Category already exists",
                });
            }

            const category = await Category.create({
                categoryName,
            });

            return res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: category,
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error,
            });

        }
    }

   static async getAllCategories(req: Request, res: Response) {

        try {

            const categories = await Category.findAll();

            return res.status(200).json({
                success: true,
                data: categories,
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });

        }

    }
   
   static async deleteCategory(req:Request,res:Response){
const {id} = req.params
    if(!id){
        res.status(400).json({
            message: "please provide Id"
        })
        return
    }
    await Category.destroy({
        where:{
            id
        }
    })
    res.status(200).json({
        message:  "category deleted successfully"
    })
    }

}

export default new CategoryController();
*/