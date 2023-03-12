import { BaseDatabase } from "../../../src/database/BaseDatabase"
import { Role, UserDB } from "../../../src/types"


export class UserDatabaseMock extends BaseDatabase {
    public static TABLE_USERS = "users"

    public getUsers = async (): Promise<UserDB[]> => {
        return [
            {
                id: "id-mock",
                nick_name: "Normal Mock",
                email: "normal@email.com",
                password: "hash-password",
                role: Role.NORMAL,
                created_at: new Date().toISOString(),
            },
            {
                id: "id-mock",
                nick_name: "Admin Mock",
                email: "admin@email.com",
                password: "hash-password",
                role: Role.ADMIN,
                created_at: new Date().toISOString(),
            }
        ]
    }

    public findUserById = async (id: string): Promise<UserDB | undefined> => {
        switch (id) {
            case "id-mock-normal":
                return {
                    id: "id-mock-normal",
                    nick_name: "Normal Mock",
                    email: "normal@email.com",
                    password: "hash-password",
                    role: Role.NORMAL,
                    created_at: new Date().toISOString(),
                }
            case "id-mock-admin":
                return {
                    id: "id-mock-amin",
                    nick_name: "Admin Mock",
                    email: "admin@email.com",
                    password: "hash-password",
                    role: Role.ADMIN,
                    created_at: new Date().toISOString(),
                }
            default:
                return undefined
        }
    }

    public findUserByEmail = async (email: string): Promise<UserDB | undefined> => {
        switch (email) {
            case "normal@email.com":
                return {
                    id: "id-mock",
                    nick_name: "Normal Mock",
                    email: "normal@email.com",
                    password: "hash-password",
                    role: Role.NORMAL,
                    created_at: new Date().toISOString(),
                }
            case "admin@email.com":
                return {
                    id: "id-mock",
                    nick_name: "Admin Mock",
                    email: "admin@email.com",
                    password: "hash-password",
                    role: Role.ADMIN,
                    created_at: new Date().toISOString(),
                }
            default:
                return undefined
        }
    }

    public insertUser = async (userDB: UserDB): Promise<void> => {
    }

    public editUser = async (newUserDB: UserDB, id: string): Promise<void> => {
    }

    public deleteUser = async (id: string): Promise<void> => {
    }

}