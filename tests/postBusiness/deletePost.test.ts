import { PostBusiness } from "../../src/business/PostBusiness"
import { DeletePostInputDTO } from "../../src/dtos/PostDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { PostDatabaseMock } from "../mocks/database/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"


describe("delete", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )
    
    test("teste de deletar um usuário", async () => {
        const input: DeletePostInputDTO = {
            idToDelete: "id-post-mock2",
            token: "token-mock-admin"
        }
        
        const response = await postBusiness.deletePost(input)       
        expect(response).toBe(true)
    })

    test("disparar erro se o token for inválido", async () => {
        expect.assertions(2)

        try {
            const input: DeletePostInputDTO = {
                idToDelete: "id-mock-admin",
                token: "token-mock-admin-errado"
            }
    
            await postBusiness.deletePost(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Usuário não está logado")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("disparar erro se o id não existir", async () => {
        expect.assertions(2)

        try {
            const input: DeletePostInputDTO = {
                idToDelete: "id-mock-errado",
                token: "token-mock-admin"
            }
    
            await postBusiness.deletePost(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("'id' não existe")
                expect(error.statusCode).toBe(404)
            }
        }
    })
})
