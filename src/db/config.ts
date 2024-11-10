import { Dialect } from "sequelize"

const PORT = process.env.DB_PORT && !isNaN(+process.env.DB_PORT) ? parseInt(process.env.DB_PORT) : 5432

const config = {
    development: {
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "1122",
        host: process.env.DB_HOST || "localhost",
        port: PORT,
        dialect: "postgres" as Dialect,
        database: "todo",
        logging: false
    },
    test: {
        username: process.env.DB_TEST_USER || "postgres",
        password: process.env.DB_TEST_PASSWORD || "1122",
        host: process.env.DB_TEST_HOST || "localhost",
        port: PORT,
        dialect: "postgres" as Dialect,
        database: "todo_test",
        logging: false
    }
}

export default config