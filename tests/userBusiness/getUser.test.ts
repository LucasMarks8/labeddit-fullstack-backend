import { UserBusiness } from "../../src/business/UserBusiness"
import { Role } from "../../src/types"
import { HashManagerMock } from "../mocks/service/HashManagerMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/database/UserDatabaseMock"
import { GetUsersInputDTO } from "../../src/dtos/UserDTO"

describe("getUser", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("deve retornar uma lista de Users", async () => {
        expect.assertions(2)
        
        const input: GetUsersInputDTO = {
            token: "token-mock-normal"
        }

        const response = await userBusiness.getUsers(input)
        expect(response).toHaveLength(2)
        expect(response).toContainEqual({
            id: "id-mock",
            nickName: "Normal Mock",
            email: "normal@email.com",
            password: "hash-password",
            role: Role.NORMAL,
            createdAt: expect.any(String), // valor dinâmico (pode ser qualquer string)
        })
    })
})