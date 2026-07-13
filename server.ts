import adminSeeder from "./src/aminSeeder.ts";
import app from "./src/app.ts";
import envConfig from "./src/config/config.ts";
import categoryController from "./src/controller/categoryController.ts";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import user from "./src/database/models/user.model.ts";
import Order from "./src/database/models/order.model.ts";
import { OrderStatus } from "./src/globals/types/index.ts";

function startServer() {
  const port = envConfig.port || 4000;

  const server = app.listen(port, () => {
    console.log(`server has started at port [${port}]`);
    categoryController.seedCategory();
    adminSeeder();
  });
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"],
    },
  });
  let onlineUsers: {
    socketId: string;
    userId: string;
    role: string;
  }[] = [];
  let addToOnlineUsers = (socketId: string, userId: string, role: string) => {
    onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
    onlineUsers.push({ socketId, userId, role });
  };
  io.on("connection", (socket) => {
    const { token } = socket.handshake.auth;
    if (token) {
      jwt.verify(
        token as string,
        envConfig.jwtsecretkey as string,
        async (err: any, result: any) => {
          if (err) {
            socket.emit("error", err);
          } else {
            const userData = await user.findByPk(result.userId);
            if (!userData) {
              socket.emit("error", "no user found with that token");
              return;
            }
            //vetyo vani user id grab garni
            addToOnlineUsers(socket.id, result.userId, userData.role);
            console.log(onlineUsers);
          }
        },
      );
    } else {
      socket.emit("error", "please provide token");
    }
    socket.on("updateOrderStatus", async (data) => {
      const { status, orderId, userId } = data;

      const findUser = onlineUsers.find((user) => user.userId == userId);

      if (findUser) {
        await Order.update(
          {
            orderStatus: status,
          },
          {
            where: {
              id: orderId,
            },
          },
        );

        const updatedOrder = await Order.findByPk(orderId);

        io.to(findUser.socketId).emit("statusUpdated", updatedOrder);

        console.log("Updated order sent:", updatedOrder);
      }
    });

    console.log("client connected successfully");
  });
}

startServer();
