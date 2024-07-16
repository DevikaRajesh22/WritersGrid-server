import User from "../../domain/user";

interface IUserRepository{
    findByEmail(email:string):Promise<User|null>,
    saveUser(user:User):Promise<User|null>,
    findUserById(id:string):Promise<User|null>,
}

export default IUserRepository