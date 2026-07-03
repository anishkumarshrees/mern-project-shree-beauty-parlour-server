import  express ,{Router} from "express";
import CartController from "../controller/cartController";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import errorHandler from "../services/errorHanndler";
const router:Router = express.Router()

router.route("/").post(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Customer),errorHandler(CartController.addToCart)).get(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Customer),CartController.getCartItems)

router.route("/:proudctId").post(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Customer),CartController.deleteMyCartItems).patch(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Customer),CartController.updateCartItem)

export default router