import { Request, Response, NextFunction } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import JWT from '../utils/JWTtoken'
import dotenv from 'dotenv'
import userRepository from '../repository/userRepository'
import { decode } from 'punycode'

const jwt = new JWT()

const repository = new userRepository()
dotenv.config()

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.userToken
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No token provided" })
    }
    try {
        const decodeToken = jwt.verifyJwt(token)
        if (decodeToken && decodeToken.id) {
            let user = await repository.findUserById(decodeToken?.id)
            if (decodeToken.isBlocked) {
                return res.status(401).send({ success: false, message: 'User is blocked !!' })
            } else {
                req.userId = decodeToken.id
                next()
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
    }
}

export default userAuth
