import express from "express";
import { createCard, listCards, getCard, updateCard } from "../controller/card.controller"
import { verifyUser } from "../controller/auth.controller"
import cardCommentRouter from "./cardComment.routes"

const route = express.Router({mergeParams: true})

route.use("/cards/:cardId", cardCommentRouter)
route.post("/card", verifyUser, createCard)
route.get("/card/:cardId", verifyUser, getCard)
route.get("/cards", verifyUser, listCards)
route.patch("/cards/:cardId", updateCard)

export default route