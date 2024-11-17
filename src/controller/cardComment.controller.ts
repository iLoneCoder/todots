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

export async function updateComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { cardId, commentId } = req.params
        const { comment } = req.body

        if (!cardId) {
            throw new AppError("cardId is required", 400)
        }

        if (!commentId) {
            throw new AppError("commentId is required", 400)
        }

        if (!comment) {
            throw new AppError("comment is required", 400)
        }

        const card = await Card.findByPk(cardId)

        if (!card) {
            throw new AppError("card not found", 404)
        }

        const cardComment = await CardComment.findByPk(commentId)

        if (!cardComment) {
            throw new AppError("cardComment not found", 404)
        }

        cardComment.set({
            comment
        })

        await cardComment.save()

        res.status(201).json({
            status: "success",
            data: cardComment
        })
    } catch (error) {
        next(error)
    }
}