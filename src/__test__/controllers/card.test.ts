import { Request, Response, NextFunction } from "express";
import { createCard, getCard } from "../../controller/card.controller";
import { Card, Board } from "../../db";

jest.mock("../../db")

const mockRequest = {
    params: {
        boardId: 9,
        cardId: 4
    }
} as unknown as Request

const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
} as unknown as Response

const next: NextFunction = jest.fn();


describe("gets card", () => {
    const mockRequest = {
        params: {
            cardId: 4
        }
    } as unknown as Request

    it("should get card by boardId and cardId when they are provided", async () => {
        const findOneMethod = jest.spyOn(Card, "findOne").mockResolvedValueOnce({
            id:1,
            name: "string",
            decscription: "string",
        } as unknown as Card)
        
        await getCard(mockRequest, mockResponse, next)
        expect(mockRequest.params.cardId).not.toBeFalsy()
        expect(findOneMethod).toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: "success",
            data: {
                id:1,
                name: "string",
                decscription: "string",
            }
        })
    })

    it("should catch error when cardId is falsey", async () => {
        const mockRequest = {
            params: {
                cardId: null
            }
        } as unknown as Request

        await getCard(mockRequest, mockResponse, next)
        expect(mockRequest.params.cardId).toBeFalsy()
        expect(next).toHaveBeenCalledWith(new Error("cardId is required"))
    })

    it("should return 404 and message to user when card not found but required data cardId and boardId provided", async () => {
        const mockRequest = {
            params: {
                boardId: 3,
                cardId: 5
            }
        } as unknown as Request

        const findOneMethod = jest.spyOn(Card, "findOne").mockResolvedValue(null)

        await getCard(mockRequest, mockResponse, next)
        expect(mockRequest.params.boardId).not.toBeFalsy()
        expect(mockRequest.params.cardId).not.toBeFalsy()
        expect(findOneMethod).toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(404)
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: "success",
            message: "not found"
        })

    })
})

describe("tests create card", () => {
    it("should catch error when name is falsy", async () => {
        const mockRequest = {
            body: {
                name: null,
                description: "descriptiom",
                boardId: 3,
                boardColumnId: 5
            },
            user: {
                id: 1
            }
        } as unknown as Request
    
        await createCard(mockRequest, mockResponse, next)
        expect(mockRequest.body.name).toBeFalsy()
        expect(mockRequest.body.boardId).not.toBeFalsy()
        expect(mockRequest.body.boardColumnId).not.toBeFalsy()
        expect(next).toHaveBeenCalledWith(new Error("name is required"))
    })

    it("should catch error when boardId is falsy", async () => {
        const mockRequest = {
            body: {
                name: "todo",
                description: "descriptiom",
                boardId: null,
                boardColumnId: 5
            },
            user: {
                id: 1
            }
        } as unknown as Request

        await createCard(mockRequest, mockResponse, next)
        expect(mockRequest.body.name).not.toBeFalsy()
        expect(mockRequest.body.boardId).toBeFalsy()
        expect(mockRequest.body.boardColumnId).not.toBeFalsy()
        expect(next).toHaveBeenCalledWith(new Error("boardId is required"))

    })

    it("should catch error when boardColumnId is falsy", async () => {
        const mockRequest = {
            body: {
                name: "todo",
                description: "descriptiom",
                boardId: 3,
                boardColumnId: null
            },
            user: {
                id: 1
            }
        } as unknown as Request

        await createCard(mockRequest, mockResponse, next)
        expect(mockRequest.body.name).not.toBeFalsy()
        expect(mockRequest.body.boardId).not.toBeFalsy()
        expect(mockRequest.body.boardColumnId).toBeFalsy()
        expect(next).toHaveBeenCalledWith(new Error("boardColumnId is required"))
    })

    it("should catch error if board not found", async () => {
        const mockRequest = {
            body: {
                name: "todo",
                description: "descriptiom",
                boardId: 3,
                boardColumnId: 5
            },
            user: {
                id: 1
            }
        } as unknown as Request

        const findBoardByPk = jest.spyOn(Board, "findByPk").mockResolvedValue(null)

        await createCard(mockRequest, mockResponse, next)
        expect(mockRequest.body.name).not.toBeFalsy()
        expect(mockRequest.body.boardId).not.toBeFalsy()
        expect(mockRequest.body.boardColumnId).not.toBeFalsy()
        expect(findBoardByPk).toHaveBeenCalled()
        expect(next).toHaveBeenCalledWith(new Error("Board not found"))

    })

    it("should catch error if Board instance method findByPk fails", async () => {
        const mockRequest = {
            body: {
                name: "todo",
                description: "descriptiom",
                boardId: 3,
                boardColumnId: 5
            },
            user: {
                id: 1
            }
        } as unknown as Request

        const findBoardByPk = jest.spyOn(Board, "findByPk").mockImplementationOnce(() => Promise.reject(new Error("failed to find")))
        await createCard(mockRequest, mockResponse, next)
        expect(mockRequest.body.name).not.toBeFalsy()
        expect(mockRequest.body.boardId).not.toBeFalsy()
        expect(mockRequest.body.boardColumnId).not.toBeFalsy()
        expect(findBoardByPk).toHaveBeenCalled()
        expect(next).toHaveBeenCalledWith(new Error("failed to find"))
    })

})