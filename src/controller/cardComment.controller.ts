import { NextFunction, Request, Response } from "express";
import { Card, CardComment } from "../db";
import AppError from "../utils/auth/appError";

export async function createCardComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { cardId } = req.params
        const { comment } = req.body
        const userId = req.user.id

        if (!cardId) {
            throw new AppError("cardId is required", 400)
        }

        if (!comment) {
            throw new AppError("comment is required", 400)
        }

        const card = await Card.findByPk(cardId)

        if (!card) {
            throw new AppError("Card not found", 404)
        }

        const newComment = await CardComment.create({
            comment,
            cardId,
            userId: userId
        })

        res.status(201).json({
            status: "success",
            data: newComment
        })

    } catch (error) {
        next(error)
    }
} 