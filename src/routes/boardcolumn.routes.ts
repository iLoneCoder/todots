import express from "express"
import { createBoardColumn, listBoardColumns } from "../controller/boardColumn.controller"
import { verifyUser } from "../controller/auth.controller"
const routes = express.Router()

routes.get("/board-columns", verifyUser, listBoardColumns)
routes.get("/board-columns/:boardId", verifyUser, listBoardColumns)
routes.post("/board-column", verifyUser, createBoardColumn)

export default routes