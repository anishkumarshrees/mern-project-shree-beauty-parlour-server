import  express ,{Router} from "express";
import categoryController from "../controller/categoryController";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import errorHandler from "../services/errorHanndler";
const router:Router = express.Router()


router.route("/").get(errorHandler (categoryController.getCategories)).post(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin), errorHandler(categoryController.addCategory))

router.route("/:id").patch(userMiddleware.accessTo(Role.Admin), errorHandler(categoryController.updateCategory)).delete(userMiddleware.accessTo(Role.Admin) ,errorHandler(categoryController.deleteCategory))



export default router