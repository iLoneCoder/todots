import express, { NextFunction, Request, Response } from "express"
import * as dotenv from "dotenv"
import authRouter from "./routes/auth.routes"
import boardRouter from "./routes/boards.routes"
import cardRouter from "./routes/card.routes"
import boardColumnRouter from "./routes/boardcolumn.routes"
import AppError from "./utils/auth/appError"
import { errorMiddleware } from "./controller/error.controller"
import path from "path"

export default function createApp() {
    dotenv.config()
    
    const app = express()
    
    app.use(express.json())
    app.use("/static", express.static(path.join(__dirname, "static")))
    
    app.use("/api/v1", authRouter)
    app.use("/api/v1", boardRouter)
    app.use("/api/v1", cardRouter)
    app.use("/api/v1", boardColumnRouter)
    
    app.use("*", (req: Request, res: Response, next: NextFunction) => {
        throw new AppError("Not found", 404)
    })
    
    app.use(errorMiddleware)

    return app
}