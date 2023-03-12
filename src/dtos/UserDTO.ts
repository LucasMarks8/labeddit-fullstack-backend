import { Role, UserModel } from "../types"

export interface SignupInputDTO {
    nickName: unknown,
    email: unknown,
    password: unknown
}

export interface SignupOutputDTO {
    token: string
}

export interface LoginInputDTO {
    email: unknown,
    password: unknown
}

export interface LoginOutputDTO {
    token: string
}

export interface GetUsersInputDTO {
    token: string | undefined
}

export type GetUsersOutputDTO = UserModel[]

export interface EditUserInputDTO {
    idToEdit?: string,
    token: string | undefined,
    email?: string,
    password?: string
}

export interface EditUserOutputDTO {
    id: string,
    nickName: string,
    email: string,
    password: string,
    role: Role,
    CreatedAt: string
}

export interface DeleteUserInputDTO {
    idToDelete: string,
    token: string | undefined
}