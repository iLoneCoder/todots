import { Model, DataTypes, Association } from "sequelize"
import sequelize from "../sequelize"
import Board from "./board.model"
import Card from "./card.model"

class User extends Model {
    declare id: number
    declare email: string
    declare password: string
    declare passwordUpdatedAt: Date
    declare Board?: Board[]
    declare Card?: Card[]

    
    static associations: { 
        Board: Association<User, Board>
        Card: Association<User, Card>    
    }

    static associate() {
        this.hasMany(Board, {foreignKey: "userId"})
        this.hasMany(Card, {foreignKey: "userId"})
    }
}

User.init({
    id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passwordUpdatedAt: {
        type: DataTypes.DATE,
        field: "password_updated_at"
    }
}, {
    sequelize,
    modelName: "User",
    tableName: "users",
    createdAt: "created_at",
    updatedAt: "updated_at",
    defaultScope: {
        attributes: {exclude: ["password"]}
    },
    scopes: {
        withPassword: {
            attributes: { exclude: [] }
        }
    }
})



export default User