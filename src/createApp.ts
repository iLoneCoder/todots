import express, { NextFunction, Request, Response } from "express"
import * as dotenv from "dotenv"
import authRouter from "./routes/auth.routes"
import boardRouter from "./routes/boards.routes"
import cardRouter from "./routes/card.routes"
import boardColumnRouter from "./routes/boardcolumn.routes"


export default function createApp() {
    dotenv.config()
    
    const app = express()
    
    app.use(express.json())
    
    app.use("/api/v1", authRouter)
    app.use("/api/v1", boardRouter)
    app.use("/api/v1", cardRouter)
    app.use("/api/v1", boardColumnRouter)
    
    app.use("*", (req: Request, res: Response, next: NextFunction) => {
        res.status(404).json({
            status: "error",
            message: "not found"
        })
    })
    
    app.use((err: any, req: Request, res: Response, next: NextFunction)  => {
        const errorStatusCode = 500
        console.log(err)
        res.status(errorStatusCode).json({
            status: "error",
            message: err.message
        })
    })

    return app
}