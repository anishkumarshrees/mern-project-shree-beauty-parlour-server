import express, { Router } from "express";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import OrderController from "../controller/orderController";
import errorHandler from "../services/errorHanndler";
import orderController from "../controller/orderController";
const router: Router = express.Router();

router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(OrderController.createOrder),
  )
  .get(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.fetchMyOrders),
  );
router
  .route("/verify-pidx")
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.verifyTransaction),
  )
  .get(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.fetchMyOrderDetail),
  );
 router.route("/admin/cancel-order/:id").post(userMiddleware.isUserLoggedIn ,userMiddleware.accessTo(Role.Admin),errorHandler(orderController.cancelOrder))
  router.route("/admin/delete-order/:id").post(userMiddleware.isUserLoggedIn ,userMiddleware.accessTo(Role.Admin),errorHandler(orderController.deleteOrder))  
 router.route("/cancel-order/:id").patch(userMiddleware.isUserLoggedIn ,userMiddleware.accessTo(Role.Customer),errorHandler(orderController.cancelOrder)) 
router
  .route("/:id")
  .get(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.fetchMyOrderDetail),
  );

export default router;
