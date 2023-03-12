import { UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public findUserByEmail = async (email: string): Promise<UserDB | undefined> =>  {
        const result: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .select()
            .where({ email })

        return result[0]
    }

    public findUserById = async (id: string): Promise<UserDB | undefined> => {
        const result: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .select()
            .where({ id })

        return result[0]
    }

    public insertUser = async (userDB: UserDB): Promise<void> => {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .insert(userDB)
    }

    public getUsers = async (): Promise<UserDB[]> => {
            const result: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
                .select()

            return result
    }

    public editUser = async (newUserDB: UserDB, id: string): Promise<void> => {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .update(newUserDB)
            .where({ id })
    }

    public deleteUser = async (id: string): Promise<void> => {
        await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .del()
        .where({ id })
    }
}