import  express,{Router}  from "express";
import { AuthController } from "../controller/globals/auth/authcontroller";
import errorHandler from "../services/errorHanndler";
import userMiddleware, { Role } from "../middleware/userMiddleware";
const router:Router = express.Router()

router.route("/register").post(errorHandler( AuthController.registerUser))

router.route("/login").post(errorHandler( AuthController.login))
router.route("/forget-passowrd").post(errorHandler( AuthController.handleForgotPassword))
router.route("/verify-otp").post(errorHandler(AuthController.verifyOtp))
router.route("/reset-password").post(errorHandler(AuthController.resetPassword))
router.route("/users").get(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin),errorHandler(AuthController.fetchUsers))
router.route("/users/:id").delete(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin),errorHandler(AuthController.deleteUser))

export default router