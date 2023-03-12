import { Role, TokenPayload } from "../../../src/types"


export class TokenManagerMock {

    public createToken = (payload: TokenPayload): string => {
        if (payload.role == Role.NORMAL) {
            return "token-mock-normal"
        } else {
            return "token-mock-admin"
        }
    }

    public getPayload = (token: string): TokenPayload | null => {
        if (token == "token-mock-normal") {
            return {
                id: "id-mock",
                nickName: "Normal Mock",
                role: Role.NORMAL
            }

        } else if (token == "token-mock-admin") {
            return {
                id: "id-mock",
                nickName: "Admin Mock",
                role: Role.ADMIN
            }

        } else {
            return null
        }
    }
}