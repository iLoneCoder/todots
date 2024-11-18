import express from "express";
import { 
    createCard, 
    listCards, 
    getCard, 
    updateCard, 
    uploadCardAttachments, 
    verifyInputBeforeUpload,
    deleteCardAttachment 
} from "../controller/card.controller"
import { verifyUser } from "../controller/auth.controller"
import cardCommentRouter from "./cardComment.routes"
import { upload } from "../middlewares/multer.middleware";

const route = express.Router({mergeParams: true})

route.use("/cards/:cardId", cardCommentRouter)
route.post("/card", verifyUser, createCard)
route.get("/card/:cardId", verifyUser, getCard)
route.post("/card/:id/attachment", verifyUser, verifyInputBeforeUpload, upload.any(), uploadCardAttachments),
route.delete("/card/attachment/:id", verifyUser, deleteCardAttachment)
route.get("/cards", verifyUser, listCards)
route.patch("/cards/:cardId", updateCard)

export default route