import { UserBusiness } from "../../src/business/UserBusiness"
import { EditUserInputDTO } from "../../src/dtos/userDTO"
import { HashManagerMock } from "../mocks/service/HashManagerMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/database/UserDatabaseMock"
import { Role } from "../../src/types"
import { BadRequestError } from "../../src/errors/BadRequestError"

describe("editUser", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("dispara erro quando token for undefined", async () => {
        expect.assertions(2)

        try {
            const input: EditUserInputDTO = {
                idToEdit: "id-mock-normal",
                email: "normaleditado@email.com",
                token: undefined
            }

         await userBusiness.editUser(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token é necessário")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("dispara erro quando id for undefined", async () => {
        expect.assertions(2)

        try {
            const input: EditUserInputDTO = {
                idToEdit: undefined,
                email: "normaleditado@email.com",
                token: "token-mock-normal"
            }

         await userBusiness.editUser(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'id' é necessário")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    
    test("dispara erro quando email for undefined", async () => {
        expect.assertions(2)

        try {
            const input: EditUserInputDTO = {
                idToEdit: "id-mock-normal",
                email: "email",
                token: "token-mock-normal"
            }

         await userBusiness.editUser(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'email' deve possuir letras minúsculas, deve ter um @, letras minúsculas, ponto (.) e de 2 a 4 letras minúsculas")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})