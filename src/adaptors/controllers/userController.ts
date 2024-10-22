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
            } else if (!user?.success) {
                return res.status(200).json({ success: false, message: user?.message });
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    async profile(req: Request, res: Response) {
        try {
            const userId = req.userId
            if (userId) {
                const userProfile = await this.usercase.userGetProfile(userId)
                if (userProfile) {
                    return res.status(200).json({ success: true, userProfile })
                } else {
                    return res.status(401).json({ success: false, message: 'Authentication error' })
                }
            } else {
                return res.status(401).json({ success: false, message: 'User id not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body
            const userExist = await this.usercase.forgotPassword(email)
            if (userExist?.data.data) {
                const token = userExist.data.token
                res.status(200).json({ success: true, token: token });
            } else {
                res.status(200).json({ success: false })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async verifyOtpForgotPassword(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(" ")[1] as string;
            const userOtp: string = req.body.otp
            const save = await this.usercase.saveUserForgot(token, userOtp)
            if (save?.success) {
                res.cookie('userToken', save?.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                });
                return res.status(200).json({ success: true, token: save.token })
            } else {
                return res.status(200).json({ success: false, message: "Invalid otp" })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(" ")[1] as string;
            const { email, password } = req.body
            const userFound = await this.usercase.findUserByEmail(email)
            if (userFound) {
                let updatePassword = await this.usercase.updatePassword(email, password, token)
                if (updatePassword?.success) {
                    res.status(200).json({ success: true, message: 'Successfully logged in', token: updatePassword.token })
                } else if (!updatePassword?.success) {
                    res.status(200).json({ success: false, message: 'Something went wrong' })
                }
            } else {
                res.status(200).json({ success: false, message: 'No user found with this email !' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            res.cookie('userToken', "", {
                httpOnly: true,
                expires: new Date(0),
            });
            res.status(200).json({ success: true });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    async editProfile(req: Request, res: Response) {
        try {
            const userId = req.userId
            const userInfo: User = req.body
            const imageFile: Express.Multer.File | undefined = req.file;
            if (imageFile) {
                userInfo.image = imageFile.path
            } else {
                userInfo.image = ''
            }
            if (userId) {
                const updateData = await this.usercase.updateProfile(userId, userInfo)
                if (updateData) {
                    res.status(200).json({ success: true })
                } else {
                    res.status(401).json({ success: false, message: 'Not updated!' })
                }
            } else {
                res.status(401).json({ success: false, message: "Something went wrong !! Try again!" })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }
}

export default userController