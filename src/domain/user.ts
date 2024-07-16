interface User {
    _id?: string,
    name: string,
    email: string,
    image: string,
    password: string,
    isBlocked: boolean,
    creationTime: Date,
}
export default User