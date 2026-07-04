import adminSeeder from "./src/aminSeeder.ts";
import app from "./src/app.ts";
import envConfig from "./src/config/config.ts";
import categoryController from "./src/controller/categoryController.ts";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import user from "./src/database/models/user.model.ts";

function startServer() {
  const port = envConfig.port || 4000;

  const server = app.listen(port, () => {
    console.log(`server has started at port [${port}]`);
    categoryController.seedCategory();
    adminSeeder();
  });
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  let onlineUsers:{
    socketId:string,userId:string,role:string
  } []= [];
  let addToOnlineUsers=(socketId:string,userId:string,role:string)=>{
      onlineUsers=  onlineUsers.filter((user)=>user.userId ! ==userId)
      onlineUsers.push({socketId,userId,role})
  }
  io.on("connection", (socket) => {
    const { token } = socket.handshake.auth;
    if (token) {
      jwt.verify(
        token,
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
            addToOnlineUsers(socket.id,result.userId,userData.role)
          }
        },
      );
    }
    socket.on("updateOrderstatus",(data)=>{
        const {status,orderId,userId} = data
      const findUser =  onlineUsers.find(user=>user.userId == userId)
      if(findUser){
        io.to(findUser.socketId).emit("success","Order status updated successfully")
      }else{
        socket.emit("erroe","user is not online")
      }
    })

    console.log("client connected successfully");
  });
}

startServer();
