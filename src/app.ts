import express from "express"
import './database/connection.ts'
import authRoute from "./route/user.ts"
const app = express()





app.use("/api/",authRoute)
export default app