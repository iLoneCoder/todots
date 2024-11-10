import crypto from "crypto"
import util from "util"
import jwt from "jsonwebtoken"

const scrypt = util.promisify(crypto.scrypt)

function createSalt() {
    return crypto.randomBytes(16).toString("hex")
}

async function hashPassword(password: string, salt=createSalt()): Promise<string> {
    const hashedPassword: any = await scrypt(password, salt, 64)
    
    return `${hashedPassword.toString("hex")}.${salt}`
}

async function comparePasswords(password: string, hashedPasswordDb: string): Promise<boolean> {
    const [_, salt] = hashedPasswordDb.split(".")
    const hashedPassword = await hashPassword(password, salt)

    return hashedPassword === hashedPasswordDb
}

async function generateToken(email: string) {
    const secret = process.env.JWT_SECRET || "secret"
    const token = jwt.sign({
        email
    }, secret, {expiresIn: "7d"})

    return token
}



export {
    hashPassword,
    comparePasswords,
    generateToken
}