import { Table,Column,Model,DataType } from "sequelize-typescript";

@Table({
    tableName:"users", //uta gui ma dekhina name
    modelName:"user", //project vitra mathi ko table lai access garni name
    timestamps:true
})

//class ko name chai modelname ko rakhda ramro
class user extends Model{
    @Column({
        primaryKey : true,
        type : DataType.UUID,
        defaultValue : DataType.UUIDV4
    })
    declare id : string
    @Column({
        type : DataType.STRING,
        
    })

    declare userName:string

    @Column({
        type : DataType.STRING
    })
    declare password:string

    @Column({
        type : DataType.STRING
      
    })
    declare email:string

    @Column({
        type : DataType.ENUM('admin','customer'),
        defaultValue:"customer"
    })
    declare role:string

    @Column({
        type : DataType.STRING
    })
    declare otp:string
    
    @Column({
        type : DataType.STRING
    })
    declare optGeneratedTime : string
}

export default user