import { Request, Response, NextFunction } from "express";
import { Board, BoardColumn, Card, User } from "../db"

export async function createCard( req: Request, res: Response, next: NextFunction ) {
    try {
        const { name, description, boardId, boardColumnId} = req.body
        const { id: userId } = req.user

        // TO DO INPUT VERIFICATION
        if (!name) {
            throw new Error("name is required")
        }

        if(!boardId) {
            throw new Error("boardId is required")
        }

        if(!boardColumnId) {
            throw new Error("boardColumnId is required")
        }

        const board = await Board.findByPk(boardId)
        if (!board) {
            throw new Error("Board not found")
        }

        const boardColumn = await BoardColumn.findOne({
            where: {
                id: boardColumnId,
                boardId: boardId
            }
        })
        if (!boardColumn) {
            throw new Error("Board column not found")
        }

        const card = await Card.create({
            name,
            description,
            boardId,
            boardColumnId,
            userId
        })

        res.status(201).json({
            status: "success",
            data: card
        })
    } catch (error) {
        next(error)
    }
}

export async function listCards( req: Request, res: Response, next: NextFunction ) {
    try {
        const cards = await Card.findAll({
            include: {
                model: Board,
                attributes: ["name"]
            }
        })

        res.status(200).json({
            status: "success",
            data: cards
        })
    } catch (error) {
        next(error)
    }
}

export async function getCard( req: Request, res: Response, next: NextFunction) {
    try {
        const { boardId, cardId } = req.params

        if (!boardId) {
            throw new Error("boardId is required")
        }

        if (!cardId) {
            throw new Error("cardId is required")
        }

        const card = await Card.findOne({
            where: {
                id: cardId,
                boardId,
            },
            include: [
                {
                    model: User
                }
            ]
        })

        if (!card) {
            res.status(404).json({
                status: "success",
                message: "not found"
            })
            return
        }

        res.status(200).json({
            status: "success",
            data: card
        })
    } catch (error) {
        next(error)
    }
}

export async function updateCard(req: Request, res: Response, next: NextFunction ) {
    try {
        const query = req.query
        const { cardId } = req.params
        if (!cardId) {
            throw new Error("cardId is required")
        }

        const card = await Card.findByPk(cardId)

        if (!card) {
            throw new Error("Card not found")
        }

        const boardColumnId = query.boardColumnId && !isNaN(+query.boardColumnId) ? +query.boardColumnId : card.boardColumnId

        const updatedValues = {
            name: query.name || card.name,
            description: query.description || card.description,
            boardColumnId: boardColumnId
        }
        const column = await BoardColumn.findOne({
            where: {
                boardId: card.boardId,
                id: updatedValues.boardColumnId
            }
        })

        if (!column) {
            throw new Error("Board column not found")
        }

        card.set({
            ...card,
            ...updatedValues
        })

        await card.save()

        res.status(200).json({
            status: "success",
            data: card
        })


    } catch (error) {
        next(error)
    }
}
