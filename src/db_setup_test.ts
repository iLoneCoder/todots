import pg from "pg"
import * as dotenv from "dotenv"
import * as child_process from 'child_process'
const { Client } = pg

dotenv.config()
const port = process.env.DB_TEST_PORT && !isNaN(+process.env.DB_TEST_PORT) ? +process.env.DB_TEST_PORT : 5432
const testDbName = "todo_test"

export async function db_config() {
    // return async () => {
        try {
            const client = new Client({
                user: process.env.DB_TEST_USER || "postgres",
                password: process.env.DB_TEST_PASSWORD || "1122",
                host: process.env.DB_TEST_HOST || "localhost",
                port: port
            })
            
            await client.connect()
    
            // await client.query( "SELECT 'CREATE DATABASE todo_test' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'todo_test')")
            await client.query(`CREATE DATABASE ${testDbName}`)
            child_process.execSync("pnpm run db:migrate")
            console.log(`database created ${testDbName}`)
            client.end()
        } catch (error) {
            console.log(error)
        }
    // }
}

export async function db_drop() {
    try {
        const client = new Client({
            user: process.env.DB_TEST_USER || "postgres",
            password: process.env.DB_TEST_PASSWORD || "1122",
            host: process.env.DB_HOST || "localhost",
            port
        })
        await client.connect()

        await client.query(`DROP DATABASE ${testDbName} WITH (FORCE)`)
        console.log(`database dropped ${testDbName}`)
        client.end()
    } catch (error) {
        console.log(error)
    }
}
