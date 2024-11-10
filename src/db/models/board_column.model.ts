import { DataTypes, Model, Association } from "sequelize";
import sequelize from "../sequelize"
import Board from "./board.model";
import Card from "./card.model";

class BoardColumn extends Model {
    declare id: number
    declare name: string
    declare boardId: number
    declare Board: Board
    declare Cards: Card[]

    static associations: {
        Board: Association<BoardColumn, Board>
        Cards: Association<BoardColumn, Card>
    }

    static associate() {
        this.belongsTo(Board, { foreignKey: "boardId"})
        this.hasMany(Card, {foreignKey: "boardColumnId"})
    }
}

BoardColumn.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    boardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "board_id"
    }
}, {
    sequelize,
    modelName: "BoardColumn",
    tableName: "board_columns",
    createdAt: "created_at",
    updatedAt: "updated_at"
})

export default BoardColumn