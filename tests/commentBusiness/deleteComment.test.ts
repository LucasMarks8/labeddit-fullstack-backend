import { DeleteCommentInputDTO } from "../../src/dtos/CommentDTO"
import { CommentBusiness } from "../../src/business/CommentBusiness"
import { CommentDatabaseMock } from "../mocks/database/CommentDatabaseMock"
import { PostDatabaseMock } from "../mocks/database/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"
import { BadRequestError } from "../../src/errors/BadRequestError"

describe("deleteComment", () => {
    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("comment deletado com sucesso retorna true", async () => {
        const input: DeleteCommentInputDTO = {
            idToDelete: "id-comment-mock",
            token: "token-mock-normal"
        }

        const response = await commentBusiness.deleteComment(input)
        expect(response).toBe(true)
    })

    test("disparar erro se o token for inválido", async () => {
        expect.assertions(2)

        try {
            const input: DeleteCommentInputDTO = {
                idToDelete: "id-mock-admin",
                token: "token-mock-admin-errado"
            }
    
            await commentBusiness.deleteComment(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Usuário não está logado")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("disparar erro se o token for undefined", async () => {
        expect.assertions(2)

        try {
            const input: DeleteCommentInputDTO = {
                idToDelete: "id-mock-admin",
                token: undefined
            }
    
            await commentBusiness.deleteComment(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token é necessário")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})
