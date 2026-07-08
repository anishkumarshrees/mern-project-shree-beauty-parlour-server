import { Request, response, Response } from "express";
import Order from "../database/models/order.model";
import OrderDetails from "../database/models/orderDetails";
import user from "../database/models/user.model";
import { PaymentMethod, PaymentStatus } from "../globals/types";
import Payment from "../database/models/payment.model";
import axios from "axios";
import Product from "../database/models/product.mode";
import Cart from "../database/models/cart.model";
import Category from "../database/models/category.model";

interface IProduct {
  productId: string;
  productQty: string;
}

interface OrderRequest extends Request {
  user?: {
    id: string;
  };
}

class OrderController {
  async createOrder(req: OrderRequest, res: Response) {
    const userId = req.user?.id;
    const {
      firstName,
      lastName,
      email,
      city,
      addressLine,
      state,
      phoneNumber,
      totalAmount,
      paymentMethod,
    } = req.body;
    const products: IProduct[] = req.body.products;
    if (
      !phoneNumber ||
      !addressLine ||
      !city ||
      !state ||
      !totalAmount ||
      products.length === 0 ||
      !firstName ||
      !lastName ||
      !email
    ) {
      res.status(400).json({
        message: "please provide all the required fields",
      });
      return;
    }

    for (const product of products) {
      const dbProduct = await Product.findByPk(product.productId);

      if (!dbProduct) {
        res.status(404).json({
          message: "product not found",
        });
        return;
      }

      const requestedQty = Number(product.productQty);

      if (dbProduct.productTotalStock < requestedQty) {
        res.status(400).json({
          message: "out of stock",
        });
        return;
      }

      dbProduct.productTotalStock = dbProduct.productTotalStock - requestedQty;
      await dbProduct.save();
    }

    //for order
    console.log(userId);
    const paymentData = await Payment.create({
      paymentMethod: paymentMethod,
    });

    let data;
    const orderData = await Order.create({
      phoneNumber,
      addressLine,
      totalAmount,
      userId,
      firstName,
      lastName,
      email,
      city,
      state,
      paymentId: paymentData.id,
    });
    // for orderDetails

    products.forEach(async function (product) {
      data = await OrderDetails.create({
        quantity: product.productQty,
        productId: product.productId,
        orderId: orderData.id,
      });
      await Cart.destroy({
        where: {
          productId: product.productId,
          userId: userId,
        },
      });
    });
    //for payment

    if (paymentMethod == PaymentMethod.Khalti) {
      //khlati logic
      const data = {
        return_url: "http://localhost:5173/",
        website_url: "http://localhost:5173/",
        amount: totalAmount * 100,
        purchase_order_id: orderData.id,
        purchase_order_name: "order_" + orderData.id,
      };
      const response = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: "key 148dc9b6527a4bf2b136a86fd4096346",
          },
        },
      );
      const khaltiResponse = response.data;
      paymentData.pidx = khaltiResponse.pidx;
      paymentData.save();
      res.status(200).json({
        message: "order created successfull",
        url: khaltiResponse.payment_url,
        pidx: khaltiResponse.pidx,
        data,
      });

      console.log(response);
    } else if (paymentMethod == PaymentMethod.Esewa) {
      //baki esewa xa tesko logic
      data;
    } else {
      res.status(200).json({
        message: "order created successfully",
        data,
      });
    }
  }
  async verifyTransaction(req: OrderRequest, res: Response): Promise<void> {
    const { pidx } = req.body;
    if (!pidx) {
      res.status(400).json({
        message: "please provide pidx",
      });
      return;
    }
    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      {
        pidx: pidx,
      },
      {
        headers: {
          Authorization: "key 148dc9b6527a4bf2b136a86fd4096346",
        },
      },
    );
    const data = response.data;
    if (data.status === "completed") {
      await Payment.update(
        { PaymentStatus: PaymentStatus.Paid },
        {
          where: {
            pidx: pidx,
          },
        },
      );
      res.status(200).json({
        message: "payment verified succesffully",
      });
    } else {
      res.status(200).json({
        message: "payment not verified or cancelled",
      });
    }
  }
  async fetchMyOrders(req: OrderRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orders = await Order.findAll({
      where: {
        userId: userId,
      },
      attributes: ["totalAmount", "id", "orderStatus"],
      include: {
        model: Payment,
        attributes: ["paymentMethod", "paymentStatus"],
      },
    });
    if (orders.length > 0) {
      res.status(200).json({
        message: "order fetched successfully",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: " no data found",
        data: [],
      });
    }
  }
  async fetchMyOrdersDetail(req: OrderRequest, res: Response): Promise<void> {
    const orderId = req.params.id;
    const userId = req.user?.id;
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: userId,
      },
      include: [
        {
          model: OrderDetails,
          include: [
            {
              model: Product,
              attributes : ["productImage", "productName" , "productPrice"]
            },
            
            
          ],
          
        },
        {
          model: Payment,
        attributes: ["paymentMethod", "paymentStatus"],  
          
        },
        
        // {
        //   model : Product,
        //   include : [{
        //     model : Category
        //   }],
        //   attributes : ["productImage", "productName" , "productPrice"]
        // }
      ], attributes : ["orderStatus" , "addressLine", "state", "totalAmount" ,"phoneNumber"]
    });
    if (order) {
      res.status(200).json({
        message: "order fetched successfully",
        data: order,
      });
    } else {
      res.status(404).json({
        message: " no data found",
        data: [],
      });
    }
  }
}

export default new OrderController();
