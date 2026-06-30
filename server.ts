
import adminSeeder from "./src/aminSeeder.ts";
import app from "./src/app.ts";
import envConfig from "./src/config/config.ts";
import categoryController from "./src/controller/categoryController.ts";

function startServer(){

const port = envConfig.port || 4000

app.listen(port,()=>{

    console.log(`server has started at port [${port}]`)
    categoryController.seedCategory()
    adminSeeder()
})
}

startServer()

