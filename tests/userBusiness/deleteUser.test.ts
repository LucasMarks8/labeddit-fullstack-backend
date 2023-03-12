import { UserBusiness } from "../../src/business/UserBusiness"
import { DeleteUserInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { HashManagerMock } from "../mocks/service/HashManagerMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/database/UserDatabaseMock"

describe("delete", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    
    test("teste de deletar um usuário", async () => {
        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock-admin",
            token: "token-mock-admin"
        }
        
        const response = await userBusiness.deleteUser(input)
        console.log(response);
        
        expect(response).toBe(true)
    })

    test("disparar erro se o token for inválido", async () => {
        expect.assertions(2)

        try {
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock-admin",
                token: "token-mock-admin-errado"
            }
    
            await userBusiness.deleteUser(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'token' inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("disparar erro se o id não existir", async () => {
        expect.assertions(2)

        try {
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock-errado",
                token: "token-mock-admin"
            }
    
            await userBusiness.deleteUser(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("'id' não existe")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("disparar erro se usuário não for o criador dele mesmo ou admin", async () => {
        expect.assertions(2)

        try {
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock-normal",
                token: "token-mock-normal"
            }
    
            await userBusiness.deleteUser(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("somente o próprio usuário ou um admin pode deleta-lo")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})