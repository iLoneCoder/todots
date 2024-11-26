import express from "express"
import { createBoard, getBoardById, listBoards } from "../controller/board.controller"
import { verifyUser } from "../controller/auth.controller"
import cardRouter from "./card.routes"

const route = express.Router()
route.use("/boards/:boardId", verifyUser, cardRouter)

route.get("/boards", verifyUser, listBoards)
route.get("/board/:id", verifyUser, getBoardById)
route.post("/board", verifyUser, createBoard)

export default route