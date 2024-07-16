import IJwtToken from "@/usecase/interface/IJwtToken";
import jwt, { JwtPayload } from 'jsonwebtoken'

class JWTtoken implements IJwtToken {
    createJwt(userId: string, role: string): string {
        const jwtKey = process.env.JWT_KEY
        if (jwtKey) {
            const token: string = jwt.sign({ id: userId, role: role }, jwtKey)
            return token
        }
        throw new Error('JWT key is not defined')
    }
    verifyJwt(token: string): jwt.JwtPayload | null {
        try {
            const jwtKey = process.env.JWT_KEY as string
            const decode = jwt.verify(token, jwtKey) as JwtPayload
            return decode
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

export default JWTtoken