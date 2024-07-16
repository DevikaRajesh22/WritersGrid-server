import User from "../domain/user";
import IUserRepository from "./interface/IUserRepository";
import otpGenerate from "../infrastructure/utils/otpGenerate";
import JWTtoken from "../infrastructure/utils/JWTtoken";
import sendMail from "../infrastructure/utils/sendMail";
import hashPassword from "../infrastructure/utils/hashPassword";
import jwt from 'jsonwebtoken'

class userUseCase {
    private iUserRepository: IUserRepository
    private JWTtoken: JWTtoken
    private otpGenerate: otpGenerate
    private sendMail: sendMail
    private hashPassword: hashPassword

    constructor(
        iUserRepository: IUserRepository,
        JWTtoken: JWTtoken,
        otpGenerate: otpGenerate,
        sendMail: sendMail,
        hashPassword: hashPassword
    ) {
        this.iUserRepository = iUserRepository
        this.JWTtoken = JWTtoken
        this.otpGenerate = otpGenerate
        this.sendMail = sendMail
        this.hashPassword = hashPassword
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

    async userLogin(email:string,password:string){
        try{
            const userFound:any=await this.iUserRepository.findByEmail(email)
            if(userFound){
                let passwordMatch=await this.hashPassword.compare(password,userFound.password)
                if(!passwordMatch){
                    return { success: false, message: "Incorrect password" };
                }else if(userFound.isBlocked){
                    return {success:false,message:'User is blocked !!'}
                }else{
                    let token=this.JWTtoken.createJwt(userFound._id,'user');
                    return {success:true,token:token}
                }
            }else{
                return {success:false,message:'Email not found. Consider creating account'}
            }
        }catch(error){
            console.log(error)
        }
    }

    async userGetProfile(userId:string){
        try{
            const user=await this.iUserRepository.findUserById(userId)
            return user
        }catch(error){
            console.log(error)
        }
    }
}

export default userUseCase