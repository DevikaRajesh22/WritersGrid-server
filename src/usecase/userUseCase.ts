import User from "../domain/user";
import IUserRepository from "./interface/IUserRepository";
import otpGenerate from "../infrastructure/utils/otpGenerate";
import JWTtoken from "../infrastructure/utils/JWTtoken";
import sendMail from "../infrastructure/utils/sendMail";
import hashPassword from "../infrastructure/utils/hashPassword";
import Cloudinary from "../infrastructure/utils/cloudinary";
import jwt from 'jsonwebtoken'

class userUseCase {
    private iUserRepository: IUserRepository
    private JWTtoken: JWTtoken
    private otpGenerate: otpGenerate
    private sendMail: sendMail
    private hashPassword: hashPassword
    private cloudinary: Cloudinary

    constructor(
        iUserRepository: IUserRepository,
        JWTtoken: JWTtoken,
        otpGenerate: otpGenerate,
        sendMail: sendMail,
        hashPassword: hashPassword,
        Cloudinary: Cloudinary
    ) {
        this.iUserRepository = iUserRepository
        this.JWTtoken = JWTtoken
        this.otpGenerate = otpGenerate
        this.sendMail = sendMail
        this.hashPassword = hashPassword
        this.cloudinary = Cloudinary
    }

    async findUser(userInfo: User) {
        try {
            const userFound = await this.iUserRepository.findByEmail(userInfo.email)
            if (userFound) {
                return { status: 200, data: { data: true, userFound } }
            } else {
                const otp = await this.otpGenerate.generateOtp(4)
                let token = jwt.sign(
                    { userInfo, otp },
                    process.env.JWT_KEY as string,
                    { expiresIn: '5m' }
                );
                const mail = await this.sendMail.sendOtp(userInfo.name, userInfo.email, otp)
                return { status: 200, data: { data: false, token: token } }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async saveUser(token: string, userOtp: string) {
        try {
            let decodeToken = await this.JWTtoken.verifyJwt(token)
            if (decodeToken) {
                if (userOtp == decodeToken.otp) {
                    const hashedPassword = await this.hashPassword.createHash(decodeToken.userInfo.password)
                    decodeToken.userInfo.password = hashedPassword
                    const userSave = await this.iUserRepository.saveUser(decodeToken.userInfo)
                    if (userSave) {
                        let createdToken = this.JWTtoken.createJwt(userSave._id as string, 'user')
                        return { success: true, token: createdToken }
                    } else {
                        return { success: false, message: 'Internal server error' }
                    }
                } else {
                    return { success: false, message: 'Incorrect OTP' }
                }
            } else {
                return { success: false, message: 'No token! Try again..' }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async userLogin(email: string, password: string) {
        try {
            const userFound: any = await this.iUserRepository.findByEmail(email)
            if (userFound) {
                let passwordMatch = await this.hashPassword.compare(password, userFound.password)
                if (!passwordMatch) {
                    return { success: false, message: "Incorrect password" };
                } else if (userFound.isBlocked) {
                    return { success: false, message: 'User is blocked !!' }
                } else {
                    let token = this.JWTtoken.createJwt(userFound._id, 'user');
                    return { success: true, token: token }
                }
            } else {
                return { success: false, message: 'Email not found. Consider creating account' }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async userGetProfile(userId: string) {
        try {
            const user = await this.iUserRepository.findUserById(userId)
            return user
        } catch (error) {
            console.log(error)
        }
    }

    async updateProfile(id: string, userInfo: User) {
        try {
            let userExists = await this.iUserRepository.findUserById(id)
            if (userExists) {
                let uploadImage = await this.cloudinary.saveToCloudinary(userInfo.image)
                userInfo.image = uploadImage
                let res = await this.iUserRepository.updateUser(id, userInfo)
                return res
            }
        } catch (error) {
            console.log(error)
        }
    }

    async forgotPassword(email: string) {
        try {
            const userFound = await this.iUserRepository.findByEmail(email)
            if (userFound) {
                const otp = await this.otpGenerate.generateOtp(4)
                let token = jwt.sign(
                    { userFound, otp },
                    process.env.JWT_KEY as string,
                    { expiresIn: '5m' }
                );
                const mail = await this.sendMail.forgotSendOtp(
                    userFound.name, email, otp
                );
                return {
                    status: 200,
                    data: {
                        data: true,
                        token: token,
                    },
                }
            } else {
                return {
                    status: 200,
                    data: {
                        data: false,
                    },
                };
            }
        } catch (error) {
            console.log(error)
        }
    }

    async saveUserForgot(token: string, userOtp: string) {
        try {
            let decodeToken = this.JWTtoken.verifyJwt(token)
            if (decodeToken?.otp == userOtp) {
                let createdToken = this.JWTtoken.createJwt(decodeToken.userFound._id, "user")
                return { success: true, token: createdToken }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async findUserByEmail(email:string){
        try{
            const findUser=await this.iUserRepository.findByEmail(email)
            if(findUser){
                return true
            }
            return false
        }catch(error){
            console.log(error)
        }
    }

    async updatePassword(email:string,password:string,token:string){
        try{
            let decodeToken=this.JWTtoken.verifyJwt(token)
            const hashedPassword=await this.hashPassword.createHash(password)
            if(hashedPassword && decodeToken){
                let createdToken=this.JWTtoken.createJwt(decodeToken.userFound._id,'user')
                const updateUser=await this.iUserRepository.resetPassword(email,hashedPassword)
                if(updateUser){
                    return { success: true, token: createdToken }
                }else{
                    return {success:false}
                }
            }else{
                return {success:false}
            }
        }catch(error){
            console.log(error)
        }
    }
}

export default userUseCase