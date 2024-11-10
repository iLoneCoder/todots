import express, { NextFunction, Request, Response } from "express";
const routes = express.Router({mergeParams: true})

routes.post("/card-comment", (req: Request, res: Response, next: NextFunction) => {res.status(200).json({message: "create card comment"})})

export default routes