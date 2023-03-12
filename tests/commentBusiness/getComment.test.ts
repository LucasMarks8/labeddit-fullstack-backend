import { CommentBusiness } from "../../src/business/CommentBusiness"
import { GetCommentsInputDTO } from "../../src/dtos/CommentDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { CommentDatabaseMock } from "../mocks/database/CommentDatabaseMock"
import { PostDatabaseMock } from "../mocks/database/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"

describe("getComment", () => {
    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("deve retornar uma lista de comments", async () => {
        expect.assertions(2)

        const input: GetCommentsInputDTO = {
            token: "token-mock-normal"
        }

        const response = await commentBusiness.getComment(input)
        expect(response).toHaveLength(2)
        expect(response).toContainEqual({
            id: "id-comment-mock",
            postId: "id-post-mock",
            userId: "id-mock",
            comments: "primeiro comment mock",
            likes: 0,
            dislikes: 0,
            createdAt: expect.any(String)
        })
    })

    test("dispara erro se o token for inválido", async () => {
        expect.assertions(2)
        
        try {
            const input: GetCommentsInputDTO = {
                token: undefined
            }

            await commentBusiness.getComment(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token é necessário")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})
