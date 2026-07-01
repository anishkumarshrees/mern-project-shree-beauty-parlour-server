import  express,{Router}  from "express";
import { AuthController } from "../controller/globals/auth/authcontroller";
import errorHandler from "../services/errorHanndler";
const router:Router = express.Router()

router.route("/register").post(errorHandler( AuthController.registerUser))

router.route("/login").post(errorHandler( AuthController.login))
router.route("/forget-passowrd").post(errorHandler( AuthController.handleForgotPassword))
router.route("/verify-otp").post(errorHandler(AuthController.verifyOtp))
router.route("/reset-password").post(errorHandler(AuthController.resetPassword))

export default router