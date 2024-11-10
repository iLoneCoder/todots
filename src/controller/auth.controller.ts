import {NextFunction, Request, Response} from "express"
import jwt from "jsonwebtoken"
import { User } from "../db"
import { hashPassword, comparePasswords, generateToken } from "../utils/auth/auth"
import { Op } from "sequelize"

export async function signUp(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password, confirmPassword } = req.body

        if (!email) {
            throw new Error("provide email")
        }

        if (!password) {
            throw new Error("provide password")
        }

        if (!confirmPassword) {
            throw new Error("provide confirmPassword")
        }

        if(password !== confirmPassword) {
            throw new Error("password and confirmPassword must match")
        }

        const hashedPassword = await hashPassword(password)
        
        let user = await User.findOne({
            where: {
                email
            }
        })

        if (user) {
           throw new Error("email is unique")
        }
        
        user = await User.create({
            email,
            password: hashedPassword  
        })

        res.status(201).json({
            status: "success",
            data: {
                id: user.id,
                email: user.email
            }
        })

    } catch (error) {
        next(error)
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const {email, password} = req.body

        if(!email) {
            throw new Error("email is required")
        }

        if(!password) {
            throw new Error("password is required")
        }

        const user = await User.scope("withPassword").findOne({
            where: {
                email: email
            }
        })

        if (!user) {
            throw new Error("email or password is incorrect")
        }

        const passwordIsCorrect = await comparePasswords(password, user.password)

        if (!passwordIsCorrect) {
            throw new Error("email or password is incorrect")
        }

        const token = await generateToken(email)

        res.status(200).json({
            status: "success",
            token
        })
    } catch (error) {
        next(error)
    }
}

export async function userStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const tokenWithBearer = req.headers.authorization
        if (!tokenWithBearer?.includes("Bearer")) {
            throw new Error("Not authorized")
        }

        interface UserDetailsType {
            email: string,
            iat: number,
            exp: number
        }

        const token = tokenWithBearer.replace("Bearer ", "")
        const secret = process.env.JWT_SECRET || "secret"
        const userDetails = jwt.verify(token, secret) as UserDetailsType

        const user = await User.findOne({
            where: {
                email: userDetails.email,
                [Op.or]: [
                    {
                        passwordUpdatedAt: { [Op.is]: null }
                    },
                    {
                        passwordUpdatedAt: { [Op.lt]: new Date(userDetails.iat * 1000) }
                    }
                ]
            }
        })
        // console.log(user)
        if (!user) {
            throw new Error("Not authorized")
        }

        res.status(200).json({
            status: "success",
            message: "Authorized"
        })
    } catch (error) {
        next(error)
    }
}

export async function verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
        const tokenWithBearer = req.headers.authorization
        if (!tokenWithBearer?.includes("Bearer")) {
            throw new Error("Not authorized")
        }

        interface UserDetailsType {
            email: string,
            iat: number,
            exp: number
        }

        const token = tokenWithBearer.replace("Bearer ", "")
        const secret = process.env.JWT_SECRET || "secret"
        const userDetails = jwt.verify(token, secret) as UserDetailsType

        const user = await User.findOne({
            where: {
                email: userDetails.email,
                [Op.or]: [
                    {
                        passwordUpdatedAt: { [Op.is]: null }
                    },
                    {
                        passwordUpdatedAt: { [Op.lt]: new Date(userDetails.iat * 1000) }
                    }
                ]
            }
        })
        // console.log(user)
        if (!user) {
            throw new Error("Not authorized")
        }

        type SafeUser = Omit<User, "password">

        req.user = user as SafeUser

        next()
    } catch (error) {
        next(error)
    }
}

export function sum(a:number, b:number): number {
    return a + b
}