import { Sequelize } from "sequelize";
import config from "./config";
import * as dotenv from "dotenv";

dotenv.config()


const NODE_ENV = process.env.NODE_ENV || "development"
// NODE_ENV as keyof typeof config
const { username, password, database, dialect, port, host, logging } = config[ NODE_ENV as keyof typeof config]
let sequelize: Sequelize

function getSequelizeInstance() {
    if(!sequelize) {
        return new Sequelize(config[NODE_ENV as keyof typeof config])
    }

    return sequelize
}


export default getSequelizeInstance()

