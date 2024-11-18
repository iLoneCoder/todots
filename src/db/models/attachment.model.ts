import { Model, DataTypes, Association } from "sequelize"
import sequelize from "../sequelize"
import Card from "./card.model"
import User from "./user.model"

class Attachment extends Model {
    declare id: number
    declare name: string
    declare cardId: number
    declare userId: number
    declare Card: Card
    declare User: User

    static associations: { 
        Card: Association<Attachment, Card>, 
        User: Association<Attachment, User>
    }

    static associate() {
        this.belongsTo(Card, { foreignKey: "cardId" })
        this.belongsTo(User, { foreignKey: "userId" })
    }
}

Attachment.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
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
    modelName: "Attachment",
    tableName: "attachments",
    createdAt: "created_at",
    updatedAt: "updated_at"
})

export default Attachment