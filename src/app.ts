import express from "express"
import './database/connection.ts'
import authRoute from "./route/user.ts"

import cateogryRoute from "./route/categoryController.ts"
import productRoute from "./route/productRoute.ts"


import orderRoute from "./route/orderRoute.ts"
import cartRoute from "./route/cartRoute.ts"
import cors from "cors"
const app = express()
app.use(cors({
    origin:"*"
}))
app.use(express.json());
app.use("/api/",authRoute)
app.use("/api/category",cateogryRoute)
app.use("/api/product",productRoute)
app.use("/api/order",orderRoute)
app.use("/api/cart",cartRoute)
app.use(express.static("./src/uploads"))
export default app