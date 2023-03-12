import { CreateCommentInputDTO, GetCommentInputDTO } from "../../src/dtos/CommentDTO"
import { CommentBusiness } from "../../src/business/CommentBusiness"
import { CommentDatabaseMock } from "../mocks/database/CommentDatabaseMock"
import { PostDatabaseMock } from "../mocks/database/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"

describe("createComment", () => {
    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("comment bem-sucedido retorna true", async () => {
        const input: CreateCommentInputDTO = {
            postId: "id-post-mock",
            token: "token-mock-normal",
            comments: "Novo comment"
        }

        const response = await commentBusiness.createComment(input)
        expect(response).toBe(true)
    })

    test("disparar erro se o token for inválido", async () => {
        expect.assertions(2)

        try {
            const input: CreateCommentInputDTO = {
                postId: "id-post-mock",
                token: "token-mock-normalerrado",
                comments: "Novo comment"
            }

            await commentBusiness.createComment(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'token' inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("comment diferente de string dispara erro", async () => {
        expect.assertions(2)
        
        try {
            const input: CreateCommentInputDTO = {
                postId: "id-post-mock",
                token: "token-mock-normal",
                comments: null
            }
    
            await commentBusiness.createComment(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'comments' deve ser uma string")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("disparar erro se o token for ausente", async () => {
        expect.assertions(2)

        try {
            const input: CreateCommentInputDTO = {
                postId: "id-post-mock",
                token: undefined,
                comments: "Novo comment"
            }

            await commentBusiness.createComment(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token ausente")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})
