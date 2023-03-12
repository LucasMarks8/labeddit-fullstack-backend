import { GetCommentInputDTO } from "../../src/dtos/CommentDTO"
import { CommentBusiness } from "../../src/business/CommentBusiness"
import { CommentDatabaseMock } from "../mocks/database/CommentDatabaseMock"
import { PostDatabaseMock } from "../mocks/database/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"
import { BadRequestError } from "../../src/errors/BadRequestError"

describe("getCommentById", () => {
    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("deve retornar um comment by id", async () => {
        const input: GetCommentInputDTO = {
            idToSearch: "id-comment-mock2",
            token: "token-mock-normal"
        }

        const response = await commentBusiness.getCommentById(input)

        expect(response).toEqual({
            id: "id-comment-mock2",
            postId: "id-post-mock2",
            userId: "id-mock2",
            comments: "segundo comment mock",
            likes: 0,
            dislikes: 0,
            createdAt: expect.any(String)
        })
    })

    test("dispara erro se o token for inválido", async () => {
        expect.assertions(2)

        try {
            const input: GetCommentInputDTO = {
                idToSearch: "id-comment-mock2",
                token: undefined
            }

            await commentBusiness.getCommentById(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token é necessário")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})