import { NextFunction, Request, Response } from "express";
import { Card, CardComment } from "../db";

export async function createCardComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { cardId } = req.params
        const { comment } = req.body
        const userId = req.user.id

        if (!cardId) {
            throw new Error("cardId is required")
        }

        if (!comment) {
            throw new Error("comment is required")
        }

        const card = await Card.findByPk(cardId)

        if (!card) {
            throw new Error("Card not found")
        }

        const newComment = await CardComment.create({
            comment,
            cardId,
            userId
        })

        res.status(201).json({
            status: "success",
            data: newComment
        })
        
    } catch (error) {
        next(error)
    }
} 