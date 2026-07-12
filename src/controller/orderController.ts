import { Request, response, Response } from "express";
import Order from "../database/models/order.model";
import OrderDetails from "../database/models/orderDetails";
import user from "../database/models/user.model";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../globals/types";
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
  params: {
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

    const orderDetails = await Promise.all(
      products.map(async function (product) {
        const orderDetail = await OrderDetails.create({
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
        return orderDetail;
      }),
    );
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
        data: orderDetails,
      });

      console.log(response);
    } else if (paymentMethod == PaymentMethod.Esewa) {
      //baki esewa xa tesko logic
      orderDetails;
    } else {
      res.status(200).json({
        message: "order created successfully",
        data: orderDetails,
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
   
      const orders = await Order.findAll({
       
        attributes : ["totalAmount","id","orderStatus"], 
        include : {
          model : Payment, 
          attributes : ["paymentMethod", "paymentStatus"]
        }
      
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
  async fetchAllMyOrders(req: OrderRequest, res: Response): Promise<void> {
    console.log("✅ fetchAllMyOrders called");
   
    const orders = await Order.findAll({
     
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
  async fetchMyOrderDetail(req: OrderRequest, res: Response): Promise<void> {
    const orderId = req.params.id;
    const userId = req.user?.id;

    const order = await Order.findOne({
      where: {
        id: orderId,
        userId,
      },
      attributes: [
        "id",
        "orderStatus",
        "addressLine",
        "city",
        "state",
        "totalAmount",
        "phoneNumber",
        "firstName",
        "lastName",
        "email",
        "userId",
      ],
      include: [
        {
          model: Payment,
          attributes: ["paymentMethod", "paymentStatus"],
        },
      ],
    });

    if (!order) {
      res.status(404).json({
        message: "No order found",
        data: [],
      });
      return;
    }

    const orders = await OrderDetails.findAll({
      where: {
        orderId,
      },
      include: [
        {
          model: Product,
          include: [
            {
              model: Category,
            },
          ],
          attributes: ["productImage", "productName", "productPrice"],
        },
      ],
    });

    const items = orders.map((orderDetail) => {
      const detail = orderDetail.toJSON() as any;
      return {
        id: detail.id,
        quantity: detail.quantity,
        productId: detail.productId,
        product: detail.Product,
      };
    });

    res.status(200).json({
      message: "Order fetched successfully",
      data: orders,
      order,
      items,
    });
  }
  async fetchMyOrderDetails(req: OrderRequest, res: Response): Promise<void> {
    const orderId = req.params.id;
    const userId = req.user?.id;

    const order = await Order.findOne({
      where: {
        id: orderId,
       
      },
      attributes: [
        "id",
        "orderStatus",
        "addressLine",
        "city",
        "state",
        "totalAmount",
        "phoneNumber",
        "firstName",
        "lastName",
        "email",
        "userId",
      ],
      include: [
        {
          model: Payment,
          attributes: ["paymentMethod", "paymentStatus"],
        },
      ],
    });

    if (!order) {
      res.status(404).json({
        message: "No order found",
        data: [],
      });
      return;
    }

    const orders = await OrderDetails.findAll({
      where: {
        orderId,
      },
      include: [
        {
          model: Product,
          include: [
            {
              model: Category,
            },
          ],
          attributes: ["productImage", "productName", "productPrice"],
        },
      ],
    });

    const items = orders.map((orderDetail) => {
      const detail = orderDetail.toJSON() as any;
      return {
        id: detail.id,
        quantity: detail.quantity,
        productId: detail.productId,
        product: detail.Product,
      };
    });

    res.status(200).json({
      message: "Order fetched successfully",
      data: orders,
      order,
      items,
    });
  }

  async cancelOrder(req:OrderRequest,res:Response):Promise<void>{
    const userId = req.user?.id
    const orderId = req.params.id
   const [order] = await Order.findAll({
      where : {
        userId : userId,
        id: orderId
      }
    })
    if(!order){
      res.status(400).json({
        message : "no order with that id"
      })
      return
    }
    //check order status
    if(order.orderStatus === OrderStatus.preparation || order.orderStatus === OrderStatus.ontheway){
      res.status(403).json({
        message : " you cannot cancelled order now"
      })
      return
    }
    await Order.update({
      orderStatus : OrderStatus.Cancelled
    },{
      where : {
        id : orderId
      }
    })
    res.status(200).json({
      message : "order cancelled successfully"
    })
  }
  async changeOrderStatus(req:OrderRequest,res:Response){
    const orderId = req.params.id
    const {orderStatus} = req.body
    if(!orderId || !orderStatus){
      res.status(400).json({
        message : "please provide orderId and orderStatus"
      })
    }
    await Order.update({orderStatus : orderStatus},{
      where :{
        id : orderId
      }
    })
    res.status(200).json({
      message : "order Status updated successfully"
    })
  }
  async deleteOrder(req:OrderRequest,res:Response){
    const orderId = req.params.id
    const order = await Order.findByPk(orderId)
    const paymentId = order?.paymentId
    if(!orderId){
      res.status(404).json({
        message : "you dont have that orderId order"
      })
      return
    }
    await OrderDetails.destroy({
      where : {
        orderId : orderId
      }
    })
    await Payment.destroy({
      where : {
        id : paymentId
      }
    })
    await Order.destroy({
      where : {
        id : orderId
      }
    })
  }
}

export default new OrderController();
