import express from "express"
const router = express.Router()
import { login, signUp, userStatus } from "../controller/auth.controller"

router.post("/auth/signup", signUp)
router.post("/auth/login", login)
router.get("/auth/status", userStatus)

export default router