import { createClient } from "redis";


type RedisClient = ReturnType<typeof createClient>
let client: RedisClient

async function createRedisClient() {
    client = createClient({
        password: process.env.REDIS_PASSWORD
    })
    client.on("error", err => console.log("redis client error", err))
    client = await client.connect()

    return client
}



export default createRedisClient()