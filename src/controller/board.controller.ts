import { NextFunction, Request, Response } from "express";
import { Board, Card, BoardColumn, User } from "../db";


export async function createBoard(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body
        const {id: userId} = req.user 

        const board = await Board.create({ name, userId })

        res.status(201).json({
            status: "success",
            data: board
        })
    } catch (error) {
        next(error)
    }
}

export async function listBoards(req: Request, res: Response, next: NextFunction) {
    try {
        const boards = await Board.findAll()
        console.log(req.user?.email, "hh")
        res.status(200).json({
            status: "success",
            data: boards
        })
    } catch (error) {
        next(error)
    }
}

export async function getBoardById(req: Request, res: Response, next: NextFunction){
    try {
        const {id: boardId} = req.params
        
        const board = await Board.findByPk(boardId, {
            include: [
                {
                    model: BoardColumn,
                    include: [{
                        model: Card
                    }]
                },
                {
                    model: User,
                    attributes: ["id", "email"]
                }
        ]
        })
    
        res.status(200).json({
            status: "success",
            data: board
        })
        
    } catch (error) {
        next(error)
    }
}