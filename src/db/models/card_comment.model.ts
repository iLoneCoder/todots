import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../sequelize";
import Card from "./card.model";
import User from "./user.model";

class CardComment extends Model {
    declare id: number
    declare comment: string
    declare cardId: number
    declare userId: number

    declare Card?: Card
    declare User?: User

    static associations: { 
        Card: Association<CardComment, Card>,
        User: Association<CardComment, User>
    };

    static associate() {
        this.belongsTo(Card, { foreignKey: "cardId" })
        this.belongsTo(User, { foreignKey: "userId"})
    }
}

CardComment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "card_id"
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id"
    }
}, {
    sequelize,
    modelName: "CardComment",
    tableName: "card_comments",
    createdAt: "created_at",
    updatedAt: "updated_at"
})

export default CardComment



