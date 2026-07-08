import { Table,Column,Model,DataType, Min } from "sequelize-typescript";
import { OrderStatus } from "../../globals/types";

@Table({
    tableName:"orders", //uta gui ma dekhina name
    modelName:"Order",
    timestamps:true
})

class Order extends Model{
    @Column({
        primaryKey:true,
        type:DataType.UUID,
        defaultValue : DataType.UUIDV4
    })
    declare id : string

    @Column({
        type : DataType.STRING,
        allowNull : false,
       validate:{
        len:{
            args:[10,10],
            msg : "phone number must be 10 digits "
        }
       }
    })
    declare phoneNumber:string

    @Column({
        type : DataType.STRING,
        
    })
    declare addressLine:string
     @Column({
        type : DataType.STRING,
       
    })
    declare city:string
     @Column({
        type : DataType.STRING,
        allowNull:false
    })
    declare state:string

    @Column({
        type : DataType.FLOAT,
        allowNull: false
    })
    declare totalAmount:number


    @Column({
        type : DataType.ENUM(OrderStatus.Cancelled,OrderStatus.Delivered,OrderStatus.Pending,OrderStatus.ontheway,OrderStatus.preparation),
        defaultValue : OrderStatus.Pending
    })
    declare orderStatus:string

    @Column({
        type : DataType.STRING,
        allowNull : false,
        defaultValue : "firsName"
    })
    declare firstName : string

    @Column({
        type : DataType.STRING,
        allowNull : false,
        defaultValue : "lastName"
    })
    declare lastName : string

    @Column({
        type : DataType.STRING,
        allowNull : false,
        defaultValue : "user@gmail.com"
    })
    declare email : string

}

export default Order