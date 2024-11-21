import redisClient from "../../redis/index"
import AppError from "./appError"

async function apiCallLimiter(email:string) {
    const client = await redisClient

    await client.set(email, 0, {
        EX: 60 * 60,
        NX: true
    })

    const callsStr = await client.get(email)
    const callsQuantity = callsStr && !isNaN(+callsStr) ? parseInt(callsStr) : 0
    await client.incr(email)

    console.log({callsQuantity})
    if (callsQuantity > 1000000) {
        throw new AppError("Api call limit is reached", 403)
    }      
    
}

export default apiCallLimiter