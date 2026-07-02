import  express, { Router }  from "express";
import userMiddleware from "../middleware/userMiddleware";
import OrderController from "../controller/orderController";
import errorHandler from "../services/errorHanndler";
const router:Router = express.Router()

router.route("/").post(userMiddleware.isUserLoggedIn,errorHandler (OrderController.createOrder))

export default router