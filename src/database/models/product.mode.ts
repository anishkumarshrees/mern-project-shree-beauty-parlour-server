
import { Table,Column,Model,DataType, AllowNull, ForeignKey, BelongsTo } from "sequelize-typescript";
import Category from "./category.model";

@Table({
    tableName:"products", //uta gui ma dekhina name
    modelName:"product", //project vitra mathi ko table lai access garni name
    timestamps:true
})
class Product extends Model{
//     @ForeignKey(() => Category)
// @Column(DataType.UUID)
// declare categoryId: string;

// @BelongsTo(() => Category)
// declare Category: Category;
    @Column({
        primaryKey : true,
        type : DataType.UUID,
        defaultValue : DataType.UUIDV4
    })
    declare id : string


    @Column({
        type : DataType.STRING,
        allowNull: false
        
    })

    declare productName:string

    @Column({
        type : DataType.TEXT
    })
    declare productDescription:string

    @Column({
        type : DataType.FLOAT,
        allowNull: false
      
    })
    declare productPrice:number

     @Column({
        type : DataType.INTEGER
      
    })
    declare productTotalStock:number

     @Column({
        type : DataType.INTEGER
      
    })
    declare discount:number

     @Column({
        type : DataType.STRING
      
    })
    declare productImage:string
   
    
    
}

export default Product