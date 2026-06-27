
import app from "./src/app.ts";
import envConfig from "./src/config/config.ts";

function startServer(){

const port = envConfig.port || 4000
app.listen(port,()=>{

    console.log(`server has started at port [${port}]`)
})
}

startServer()

