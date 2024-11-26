import { promises as fs } from "fs"
import path from "path"
import { Request, Response, NextFunction } from "express";
import { Transaction } from "sequelize";
import { Attachment, Board, BoardColumn, Card, CardComment, User } from "../db"
import AppError from "../utils/auth/appError";
import sequelize from "../db/sequelize";
import { deleteFiles } from "../commands/attachments";

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
        const { boardId } = req.params

        if (!boardId) {
            throw new AppError("boardId is required", 400)
        }

        const cards = await Card.findAll({
            where: {
                boardId
            },
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
        const { cardId } = req.params

        if (!cardId) {
            throw new Error("cardId is required")
        }

        const card = await Card.findOne({
            where: {
                id: cardId
            },
            include: [
                {
                    model: CardComment
                },
                {
                    model: Attachment
                },
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

export async function verifyInputBeforeUpload(req: Request, res: Response, next: NextFunction) {
    try {
        const { id: cardId } = req.params

        if (!cardId) {
            throw new AppError("cardId is required", 400)
        }

        const card = await Card.findByPk(cardId)

        if (!card) {
            throw new AppError("card not found", 404)
        } 

        next()
    } catch (error) {
        next(error)
    }
}

export async function uploadCardAttachments(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user.id
        const {id: cardId} = req.params
        const filePaths: {
            name: string,
            cardId: number,
            userId: number
        }[] = []
        console.log(req.files)
        for (let file of req.files as Express.Multer.File[]) {
            filePaths.push({
                name: `/static/${file.filename.replace(/ /g, "%20")}`,
                cardId: +cardId,
                userId: +userId
            })
        }
        let results: Attachment[] = []

        if (filePaths.length > 0) {
            results = await sequelize.transaction(async (t:Transaction) => {
                const attachments = await Attachment.bulkCreate(filePaths, {
                    validate: true,
                    transaction: t,
                })

                return attachments
            })
        }

        res.status(201).json({
            status: "success",
            data: results
        })
    } catch (error) {
        next(error)
    }
}

export async function deleteCardAttachment(req: Request, res: Response, next: NextFunction) {
    try {
        const { id: attachmentId } = req.params
        const basePath = path.join(__dirname, "../")
        if (!attachmentId) {
            throw new AppError("Attachment id is required", 400)
        }

        const attachment = await Attachment.findByPk(attachmentId)

        if(!attachment) {
            throw new AppError("File not found", 404)
        }

        await attachment.destroy()
        
        const files = await fs.readdir(path.join(basePath, "static"))
        let fileExists = files.some((filename: string) => `/static/${filename}` === attachment.name)

        if (fileExists) await fs.unlink(path.join(basePath, attachment.name))

        res.status(201).json({
            status: "success",
            data: attachment
        })
        
    } catch (error) {
        next(error)
    }
}

export async function deleteCard(req: Request, res: Response, next: NextFunction) {
    try {
        const { cardId } = req.params

        const card = await Card.findByPk(cardId, {
            include:[{
                    model: Attachment
                }
            ]
        })
        
        if (!card) {
            throw new AppError("Card not found", 404)
        }
        console.log(card.Attachments)
        const attachmentNames = card.Attachments?.map(item => item.name) || []

        await card.destroy()

        if (attachmentNames?.length > 0) {
            await deleteFiles(attachmentNames)
        }

        res.status(204).json()
    } catch (error) {
        next(error)
    }
}
