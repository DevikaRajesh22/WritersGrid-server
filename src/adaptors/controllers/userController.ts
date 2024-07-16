import { Request, Response } from "express";
import userUseCase from "../../usecase/userUseCase";
import User from "../../domain/user";
import JWT from '../../infrastructure/utils/JWTtoken'
const jwt = new JWT()

class userController {
    private usercase: userUseCase
    constructor(usercase: userUseCase) {
        this.usercase = usercase
    }

    async verifyMail(req: Request, res: Response) {
        try {
            const userInfo = req.body
            const email: string = userInfo.email
            const name: string = userInfo.name
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                res.status(200).json({ success: false, message: 'Email is required!!' })
            } else if (!emailRegex.test(email)) {
                return res.status(400).json({ success: false, message: "Invalid email format" });
            } else if (!name) {
                res.status(200).json({ success: false, message: 'Name is required' })
            } else if (name.trim().length < 3) {
                res.status(200).json({ success: false, message: 'Name should be atleast 3 characters!!' })
            }
            const userData: any = await this.usercase.findUser(userInfo as User)
            if (!userData.data.data) {
                const token = userData?.data.token
                res.status(200).json({ success: true, token: token })
            } else {
                res.status(200).json({ success: false, message: 'User already exists !!' })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async verifyOtp(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(" ")[1] as string;
            const userOtp: string = req.body.otp;
            const saveUser = await this.usercase.saveUser(token, userOtp)
            if (saveUser?.success) {
                res.cookie('userToken', saveUser.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                })
                return res.status(200).json({ success: true, token: saveUser.token })
            } else if (!saveUser?.success) {
                return res.status(200).json({ success: false, message: saveUser ? saveUser.message : 'Verifying unsuccessfull !!' })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async resendOtp(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(" ")[1] as string;
            if (!token) {
                return res.status(401).json({ success: false, message: 'Unauthorized !!' })
            }
            const decoded = jwt.verifyJwt(token)
            if (decoded) {
                const userInfo = decoded.userInfo
                if (userInfo) {
                    const userData: any = await this.usercase.findUser(userInfo as User)
                    if (!userData.data.data) {
                        const token = userData.data.token
                        res.status(200).json({ success: true, token: token });
                    } else {
                        res.status(200).json({ success: false })
                    }
                }
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                res.status(200).json({ success: false, message: 'Email is required!!' })
            } else if (!emailRegex.test(email)) {
                return res.status(400).json({ success: false, message: "Invalid email format" });
            }
            const user = await this.usercase.userLogin(email, password)
            if (user?.success) {
                res.cookie('userToken', user.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                });
                return res.status(200).json({ success: true, token: user.token });
            }else if(!user?.success){
                return res.status(200).json({ success: false, message: user?.message });
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    async profile(req:Request,res:Response){
        try{
            const userId=req.userId
            if(userId){
                const userProfile=await this.usercase.userGetProfile()
            }
        }catch(error){
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }
}

export default userController