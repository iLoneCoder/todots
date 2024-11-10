import pkg from "pg"
import * as dotenv from "dotenv"

const { Client } = pkg
dotenv.config()

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5432
const databaseName = "todo"

const client = new Client({
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "1122",
    host: process.env.DB_HOST || "localhost",
    port: PORT || 5432
})

async function dbSetup() {
    try {
        await client.connect()

        await client.query(`CREATE DATABASE ${databaseName}`)
        console.log(`database created ${databaseName}`)
    } catch (error) {
        console.log(error)
    } finally {
        await client.end()
    }
}

dbSetup()



