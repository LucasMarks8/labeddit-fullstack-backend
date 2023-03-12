import { CommentBusiness } from "../../src/business/CommentBusiness"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"
import { CommentDatabaseMock } from "../mocks/database/CommentDatabaseMock"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { PostDatabaseMock } from "../mocks/database/PostDatabaseMock"
import { EditCommentInputDTO } from "../../src/dtos/CommentDTO"

describe("editComment", () => {
    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("dispara erro quando token for undefined", async () => {
        expect.assertions(2)

        try {
            const input: EditCommentInputDTO = {
                idToEdit: "id-mock-normal",
                token: undefined,
                comments: "Novo comment"
            }

         await commentBusiness.editComment(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token é necessário")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    
    test("dispara erro quando comment for undefined", async () => {
        expect.assertions(2)

        try {
            const input: EditCommentInputDTO = {
                idToEdit: "id-mock-normal",
                token: "token-mock-normal",
                comments: undefined
            }

         await commentBusiness.editComment(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'comments' deve ser uma string")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})