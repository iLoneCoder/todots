// import sequelize from "./sequelize";
// import { Model, ModelStatic, Sequelize } from "sequelize";
// import * as fs  from "fs";
// import * as path from "path"
// import { DataTypes } from "sequelize";

// const modelsDir = path.join(__dirname, "models")
// const modelDefiners: Array<(sequelize: Sequelize, DataType: typeof DataTypes) => ModelStatic<Model>> = []

// fs.readdirSync(modelsDir).forEach(file => {
//     console.log(file)
//     modelDefiners.push(require(path.join(modelsDir, file)).default)
// })


// const models:any[] = modelDefiners.map(modelDefiner => modelDefiner(sequelize, DataTypes))


// for (let model of models) {
//     if(model.associate) {
//         model.associate(sequelize.models)
//     }
// }

// console.log("Models: ", sequelize.models)
// export default sequelize.models
import Board from "./models/board.model";
import Card from "./models/card.model";
import BoardColumn from "./models/board_column.model";
import User from "./models/user.model";
import CardComment from "./models/card_comment.model";

Board.associate()
Card.associate()
BoardColumn.associate()
User.associate()
CardComment.associate()

export {
    Board,
    Card,
    BoardColumn,
    User
}