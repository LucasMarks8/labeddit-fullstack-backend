import { UserBusiness } from "../../src/business/UserBusiness"
import { SignupInputDTO, SignupOutputDTO } from "../../src/dtos/UserDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { HashManagerMock } from "../mocks/service/HashManagerMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/database/UserDatabaseMock"


describe("signup", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock(),

    )

    test("cadastro bem-sucedido retorna token", async () => {
        const input: SignupInputDTO = {
            nickName: "Example Mock",
            email: "example@email.com",
            password: "Exemplo123!"
        }

        const response = await userBusiness.signupUser(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("disparar erro caso name não seja string", async () => {
        expect.assertions(2)

        try {
            const input: SignupInputDTO = {
                nickName: null,
                email: "example@email.com",
                password: "Exemplo123!"
            }

            await userBusiness.signupUser(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'nickName' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("disparar erro caso email já esteja cadastrado", async () => {
        expect.assertions(2)

        try {
            const input: SignupInputDTO = {
                nickName: "Example Mock",
                email: "admin@email.com",
                password: "Exemplo123!"
            }

            await userBusiness.signupUser(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'email' já existe")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("disparar erro caso email não seja string", async () => {
        expect.assertions(2)

        try {
            const input: SignupInputDTO = {
                nickName: "Example Mock",
                email: null,
                password: "Exemplo123!"
            }

            await userBusiness.signupUser(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'email' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })


    test("deve disparar erro caso o password esteja incorreto", async () => {
        expect.assertions(2)

        try {
            const input: SignupInputDTO = {
                nickName: "Example Mock",
                email: "normal@email.com",
                password: null
            }

            await userBusiness.signupUser(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'password' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })

})
