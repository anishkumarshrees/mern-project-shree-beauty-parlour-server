import express from "express"
import './database/connection.ts'
import authRoute from "./route/user.ts"
const app = express()
import cateogryRoute from "./route/categoryController.ts"



app.use(express.json());
app.use("/api/",authRoute)
app.use("/api/category",cateogryRoute)
export default app