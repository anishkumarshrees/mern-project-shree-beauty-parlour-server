
import  express, { Router }  from "express";
import ProductController from "../controller/productController";
import userMiddleware, { Role } from "../middleware/userMiddleware";
const router:Router = express.Router()
import {multer,storage} from "../middleware/multerMiddlreware"

import errorHandler from "../services/errorHanndler";
const upload = multer({storage:storage})

router.route("/").post(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin),upload.single("productImage"),errorHandler( ProductController.createProduct)).get(errorHandler(ProductController.getAllProducts))

router.route("/:id").delete(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin), errorHandler(ProductController.deleteProduct)).patch(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin), errorHandler(ProductController.updatePrpduct)).get(errorHandler(ProductController.getSingleProduct))

export default router