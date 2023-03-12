import { PostBusiness } from "../../src/business/PostBusiness"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"
import { PostDatabaseMock } from "../mocks/database/PostDatabaseMock"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { EditPostInputDTO } from "../../src/dtos/PostDTO"

describe("editPost", () => {
    const userBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("dispara erro quando token for undefined", async () => {
        expect.assertions(2)

        try {
            const input: EditPostInputDTO = {
                idToEdit: "id-mock-normal",
                token: undefined, 
                content: "Novo post"
            }

         await userBusiness.editPost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token é necessário")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    
    test("dispara erro quando contet for undefined", async () => {
        expect.assertions(2)

        try {
            const input: EditPostInputDTO = {
                idToEdit: "id-mock-normal",
                token: "token-mock-normal",
                content: undefined
            }

         await userBusiness.editPost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'content' deve ser uma string")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})