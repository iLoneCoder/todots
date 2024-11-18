import Board from "./models/board.model";
import Card from "./models/card.model";
import BoardColumn from "./models/board_column.model";
import User from "./models/user.model";
import CardComment from "./models/card_comment.model";
import Attachment from "./models/attachment.model";

const models = [
    Board,
    Card,
    BoardColumn,
    User,
    CardComment,
    Attachment
]

models.forEach(model => {
    if (typeof model.associate === "function") {
        model.associate()
    }
})

export {
    Board,
    Card,
    BoardColumn,
    User,
    CardComment,
    Attachment
}