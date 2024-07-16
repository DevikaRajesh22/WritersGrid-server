import User from "@/domain/user";
import { UserModel } from "../database/userModel";
import IUserRepository from "@/usecase/interface/IUserRepository";

class userRepository implements IUserRepository{
    async findByEmail(email: string): Promise<User | null> {
        try{
            const userExists=await UserModel.findOne({email:email})
            if(userExists){
                return userExists
            }else{
                return null
            }
        }catch(error){
            console.log(error)
            return null
        }
    }

    async saveUser(user: User): Promise<User | null> {
        try{
            const newUser=new UserModel(user)
            await newUser.save()
            return newUser
        }catch(error){
            console.log(error)
            return null
        }
    }

    async findUserById(id: string): Promise<User | null> {
        try{
            let buyerData:User|null=await UserModel.findById(id)
            return buyerData
        }catch(error){
            console.log(error)
            return null
        }
    }
}

export default userRepository