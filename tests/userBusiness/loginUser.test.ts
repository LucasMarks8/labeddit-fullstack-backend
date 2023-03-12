import { UserBusiness } from "../../src/business/UserBusiness"
import { LoginInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { HashManagerMock } from "../mocks/service/HashManagerMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/database/UserDatabaseMock"

describe("login", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    
    test("login bem-sucedido em conta normal retorna token", async () => {
        const input: LoginInputDTO = {
            email: "normal@email.com",
            password: "password"
        }

        const response = await userBusiness.loginUser(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("login bem-sucedido em conta admin retorna token", async () => {
        const input: LoginInputDTO = {
            email: "admin@email.com",
            password: "password"
        }

        const response = await userBusiness.loginUser(input)
        expect(response.token).toBe("token-mock-admin")
    })

    test("disparar erro caso name não seja string", async () => {
        expect.assertions(2)

        try {
            const input: LoginInputDTO = {
                email: null,
                password: "Exemplo123!"
            }

            await userBusiness.loginUser(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'email' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("disparar erro caso o email não seja encontrado", async () => {
        expect.assertions(2)

        try {
            const input: LoginInputDTO = {
                email: "normalerrado@email.com",
                password: "Exemplo123!"
            }

            await userBusiness.loginUser(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("'email' não cadstrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("disparar erro caso o password não seja string", async () => {
        expect.assertions(2)

        try {
            const input: LoginInputDTO = {
                email: "normal@email.com",
                password: null
            }

            await userBusiness.loginUser(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'password' deve ser string")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar erro caso o password esteja incorreto", async () => {
        expect.assertions(2)

        try {
            const input: LoginInputDTO = {
                email: "normal@email.com",
                password: "Exemplo123"
            }

            await userBusiness.loginUser(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'password' incorreto")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})