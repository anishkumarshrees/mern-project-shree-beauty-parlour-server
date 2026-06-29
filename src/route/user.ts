import  express,{Router}  from "express";
import { AuthController } from "../controller/globals/auth/authcontroller";
const router:Router = express.Router()

router.route("/register").post(AuthController.registerUser)

router.route("/login").post(AuthController.login)
router.route("/forget-passowrd").post(AuthController.handleForgotPassword)

export default router