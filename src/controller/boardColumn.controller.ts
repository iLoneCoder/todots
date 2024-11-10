import { Request, Response, NextFunction } from "express"
import { Board, BoardColumn, Card } from "../db"

export async function createBoardColumn(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, boardId } = req.body

        const board = await Board.findByPk(boardId)
        if (!board) {
            throw new Error("Board not found")
        }

        const boardColumn = await BoardColumn.create({
            name,
            boardId
        })

        res.status(201).json({
            status: "success",
            data: boardColumn
        })

    } catch (error) {
        next(error)
    }
}

export async function listBoardColumns(req: Request, res: Response, next: NextFunction) {
    try {
        const { boardId } = req.params
        let where = {}
        if (boardId) {
            where = {
                boardId
            }
        } 
        const columns = await BoardColumn.findAll({
            where,
            include: {
                model: Card
            }
        })

        res.status(200).json({
            status: "success",
            data: columns
        })
    } catch (error) {
        next(error)
    }
}