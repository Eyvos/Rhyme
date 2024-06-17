export interface IUser{
    id?: number,
    email: string,
    username: string,
    password: string,
    isAdmin: boolean,
    createdAt?: Date,
    updatedAt?: Date
}