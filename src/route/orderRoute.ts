import  express, { Router }  from "express";
import userMiddleware from "../middleware/userMiddleware";
import OrderController from "../controller/orderController";
import errorHandler from "../services/errorHanndler";
import orderController from "../controller/orderController";
const router:Router = express.Router()

router.route("/").post(userMiddleware.isUserLoggedIn,errorHandler (OrderController.createOrder))
router.route("/verify-pidx").post(userMiddleware.isUserLoggedIn,errorHandler(orderController.verifyTransaction))

export default router