import  express ,{Router} from "express";
import categoryController from "../controller/categoryController";
const router:Router = express.Router()


router.route("/").get(categoryController.getCategories).post(categoryController.addCategory)

router.route("/:id").patch(categoryController.updateCategory).delete(categoryController.deleteCategory)



export default router