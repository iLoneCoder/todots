import express from "express";
import { verifyUser } from "../controller/auth.controller";
import { createCardComment, updateComment } from "../controller/cardComment.controller";
// nested in card.routes
const routes = express.Router({mergeParams: true})

routes.post("/card-comment", verifyUser, createCardComment)
routes.put("/card-comment/:commentId", verifyUser, updateComment)
export default routes