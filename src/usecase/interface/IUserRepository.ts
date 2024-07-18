import User from "../../domain/user";

interface IUserRepository {
    findByEmail(email: string): Promise<User | null>,
    saveUser(user: User): Promise<User | null>,
    findUserById(id: string): Promise<User | null>,
    updateUser(id: string, user: User): Promise<any>,
    resetPassword(email: string, hashedPassword: string): Promise<any>,
}

export default IUserRepository