import { Request, Response, NextFunction } from "express"

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    let statusCode = !err.statusCode ? 500 : err.statusCode

    if (err.name === "SequelizeDatabaseError") {
        err.isOperational = true
        statusCode = 400 
    }

    console.log(err)

    res.status(statusCode).json({
        status: "error",
        message: err.message
    })

}