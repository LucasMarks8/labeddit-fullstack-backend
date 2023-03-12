import { PostBusiness } from "../../src/business/PostBusiness"
import { GetPostsInputDTO } from "../../src/dtos/PostDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { PostDatabaseMock } from "../mocks/database/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"


describe("getPostComment", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("deve retornar uma lista de posts com comentários", async () => {
        
        const input: GetPostsInputDTO = {
            token: "token-mock-normal"
        }

        const response = await postBusiness.getPostComment(input)
        console.log(response);
        
        expect(response).toContain([
            {
                id: 'id-post-mock',
                content: 'primeiro post mock',
                likes: 0,
                dislikes: 0,
                comments: 0,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                creator: {
                    id: undefined,
                    name: undefined
                },
                cmt: []
              },
              {
                id: 'id-post-mock2',
                content: 'segundo post mock',
                likes: 0,
                dislikes: 0,
                comments: 0,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                creator: {
                    id: undefined,
                    name: undefined
                },
                cmt: []
              }
        ])
    })

    test("dispara erro se o tokne for inválido", async () => {
        expect.assertions(2)

        try {
            const input: GetPostsInputDTO = {
                token: undefined
            }
    
            await postBusiness.getPostComment(input)
            
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token é necessário")
                expect(error.statusCode).toBe(400)
            }
        }
        
        
    })
})