import { DataTypes, Model, Association } from "sequelize"
import sequelize from "../sequelize"
import Card from "./card.model"
import BoardColumn from "./board_column.model"
import User from "./user.model"

class Board extends Model {
    declare id: number
    declare name: string
    declare Cards?: Card[]
    
    static associations: {
        Cards: Association<Board, Card>
        BoardColumn: Association<Board, BoardColumn>
        User: Association<Board, User>
    }

    static associate() {
        this.hasMany(Card, {foreignKey: "boardId"})
        this.hasMany(BoardColumn, {foreignKey: "boardId"})
        this.belongsTo(User, {foreignKey: "userId"})
    }
}

Board.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id"
    }

}, {
    sequelize,
    modelName: "Board",
    tableName: "boards",
    createdAt: "created_at",
    updatedAt: "updated_at"
})

export default Board
