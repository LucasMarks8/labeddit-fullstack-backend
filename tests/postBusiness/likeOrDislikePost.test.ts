import { PostBusiness } from "../../src/business/PostBusiness"
import { LikeOrDislikePostInputDTO } from "../../src/dtos/PostDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { PostDatabaseMock } from "../mocks/database/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"


describe("LikeOrDislikePost", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("deve reagir a um post", async () => {

        const input: LikeOrDislikePostInputDTO = {
            idToLikeOrDislike: "id-post-mock",
            token: "token-mock-normal",
            like: true
        }

        const response = await postBusiness.likeOrDislikePost(input)
        expect(response).toBe(true)
    })

    test("token inválido dispara erro", async () => {
        expect.assertions(2)

        try {
            const input: LikeOrDislikePostInputDTO = {
                idToLikeOrDislike: "id-post-mock",
                token: undefined,
                like: true
            }
    
            await postBusiness.likeOrDislikePost(input)
            
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token é necessário")
                expect(error.statusCode).toBe(400)
            }
        }       
    })

    test("like não boolean dispara erro", async () => {
        expect.assertions(2)

        try {
            const input: LikeOrDislikePostInputDTO = {
                idToLikeOrDislike: "id-post-mock",
                token: "token-mock-normal",
                like: "true"
            }
    
            await postBusiness.likeOrDislikePost(input)
            
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'like' deve ser boolean")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})
