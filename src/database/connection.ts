import { ForeignKey, Sequelize } from "sequelize-typescript";
import envConfig from "../config/config.ts";
import user from "./models/user.model.ts";
import Product from "./models/product.mode.ts";
import Category from "./models/category.model.ts";
import OrderDetails from "./models/orderDetails.ts";
import Order from "./models/order.model.ts";
import Payment from "./models/payment.model.ts";
import Cart from "./models/cart.model.ts";

const sequelize =new Sequelize(envConfig.connectionString as string,{
     models : [__dirname + '/models']
})

try {
    sequelize.authenticate()
    .then(()=>{
        console.log("pw milyo")
    })
 .catch (err=>{
    ()=>
        console.log("pw milyo")
    
 }) 
} catch (error){
    console.log(error)
}

//migrate garna parxa/push garna parxa
//fore:true garyo vani kei change garda tarw false garda chai change garda chagne hudaina so alter:true le teslai help garxa 
sequelize.sync({force:false , alter:false})
.then(()=>{
console.log("migragted success")
})

//realtionship between prduct and category

Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Product, { foreignKey: "categoryId" });

//user and order relationship 
user.hasMany(Order)
Order.belongsTo(user)

//order and orderdetails relationship
Order.hasOne(OrderDetails)
OrderDetails.belongsTo(Order)   


//payment and order raltionship
Payment.belongsTo(Order)
Order.hasOne(Payment)

//order and product relationship
Product.hasMany(OrderDetails,{foreignKey:'productId'})
OrderDetails.belongsTo(Product,{foreignKey:'productId'})

//cart and order raltionship
Cart.belongsTo(user, { foreignKey: "userId" });
user.hasMany(Cart, { foreignKey: "userId" });

//cart and product relationship
Cart.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Cart, { foreignKey: "productId" });

export default sequelize