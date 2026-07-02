import express from "express"
import './database/connection.ts'
import authRoute from "./route/user.ts"
const app = express()
import cateogryRoute from "./route/categoryController.ts"
import productRoute from "./route/productRoute.ts"

import orderRoute from "./route/orderRoute.ts"

app.use(express.json());
app.use("/api/",authRoute)
app.use("/api/category",cateogryRoute)
app.use("/api/product",productRoute)
app.use("/api/order",orderRoute)
export default app