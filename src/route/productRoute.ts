
import  express, { Router }  from "express";
import productController from "../controller/productController";
import userMiddleware, { Role } from "../middleware/userMiddleware";
const router:Router = express.Router()

router.route("/").post(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin), productController.createProduct)

router.route("/:id").post(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin), productController.deleteProduct).patch(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin), productController.updatePrpduct)

export default router