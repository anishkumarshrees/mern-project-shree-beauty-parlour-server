
import { Table, Column,DataType, Model, PrimaryKey } from "sequelize-typescript";


@Table({
    tableName:"cart",
    modelName : "Cart",
    timestamps : true
})

class Cart  extends Model{
    @Column({
        primaryKey : true,
        type : DataType.UUID,
        defaultValue : DataType.UUIDV4

    })
    declare id:string
    @Column({
        type : DataType.INTEGER,
        allowNull: false
    })
    declare quantity:number
}

export default Cart