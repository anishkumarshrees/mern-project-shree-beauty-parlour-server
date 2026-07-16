import express from "express";
import "./database/connection";
import authRoute from "./route/user";

import cateogryRoute from "./route/categoryController";
import productRoute from "./route/productRoute";

import orderRoute from "./route/orderRoute";
import cartRoute from "./route/cartRoute";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://shree-beauty-parlour-six.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Shree Beauty Parlour API is running 🚀",
  });
});

app.use("/api/", authRoute);
app.use("/api/category", cateogryRoute);
app.use("/api/product", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/cart", cartRoute);

app.use(express.static("./src/uploads"));

export default app;
