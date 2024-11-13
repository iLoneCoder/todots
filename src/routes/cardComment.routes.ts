import express from "express";
import { verifyUser } from "../controller/auth.controller";
import { createCardComment } from "../controller/cardComment.controller";

const routes = express.Router({mergeParams: true})

routes.post("/card-comment", verifyUser, createCardComment)

export default routes