export interface IUser{
    id?: number,
    email: string,
    username: string,
    password: string,
    isAdmin: boolean,
    image: string,
    createdAt?: Date,
    updatedAt?: Date
}