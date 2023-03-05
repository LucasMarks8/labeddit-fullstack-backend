import { UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async findUserByEmail(email: string): Promise<UserDB | undefined> {
        const result: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .select()
            .where({ email })

        return result[0]
    }

    public async findUserById(id: string): Promise<UserDB | undefined> {
        const result: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .select()
            .where({ id })

        return result[0]
    }

    public async insertUser(userDB: UserDB): Promise<void> {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .insert(userDB)
    }

    public async getUsers(): Promise<UserDB[]> {
            const result: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
                .select()

            return result
    }

    public async editUser(newUserDB: UserDB, id: string): Promise<void> {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .update(newUserDB)
            .where({ id })
    }

    public async deleteUser(id: string): Promise<void> {
        await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .del()
        .where({ id })
    }
}