import { DataTypes, Model, Association } from "sequelize"
import sequelize from "../sequelize";
import Board from "./board.model";
import BoardColumn from "./board_column.model";
import User from "./user.model";
import CardComment from "./card_comment.model";
import Attachment from "./attachment.model";

class Card extends Model {
    declare id: number
    declare name: string
    declare description: string
    declare boardId: number
    declare boardColumnId: number
    declare Board?: Board
    declare BoardColumn?: BoardColumn
    declare User?: User
    declare CardComments?: CardComment[]
    declare Attachments?: Attachment[]

    static associations: {
        Board: Association<Card, Board>;
        BoardCard: Association<Card, BoardColumn>
        User: Association<Card, User>
        CardComments: Association<Card, CardComment>
        Attachments: Association<Card, Attachment>
    };

    static associate() {
        this.belongsTo(Board, {foreignKey: "boardId"})
        this.belongsTo(BoardColumn, {foreignKey: "boardColumnId"})
        this.belongsTo(User, {foreignKey: "userId"})
        this.hasMany(CardComment, { foreignKey: "cardId"} )
        this.hasMany(Attachment, { foreignKey: "cardId" })
    }
}

Card.init({
    id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    boardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "board_id"
    },
    boardColumnId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "board_column_id"
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id"
    }
}, {
    sequelize,
    modelName: "Card",
    tableName: "cards",
    createdAt: "created_at",
    updatedAt: "updated_at"
})

export default Card