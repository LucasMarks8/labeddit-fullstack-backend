import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { DeleteUserInputDTO, EditUserInputDTO, GetUsersInputDTO, LoginInputDTO, SignupInputDTO } from "../dtos/UserDTO";
import { BaseError } from "../errors/BaseError";

export class UserController {
    constructor(
        private userBusinnes: UserBusiness
    ) { }

    public signupUser = async (req: Request, res: Response) => {
        try {
            const input: SignupInputDTO = {
                nickName: req.body.nickName,
                email: req.body.email,
                password: req.body.password,
            }

            const outPut = await this.userBusinnes.signupUser(input)

            res.status(201).send(outPut)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public loginUser = async (req: Request, res: Response) => {
        try {
            const input: LoginInputDTO = {
                email: req.body.email,
                password: req.body.password,
            }

            const outPut = await this.userBusinnes.loginUser(input)

            res.status(201).send(outPut)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public getUsers = async (req: Request, res: Response) => {
        try {
            const input: GetUsersInputDTO = {
                token: req.headers.authorization
            }

            const outPut = await this.userBusinnes.getUsers(input)

            res.status(200).send(outPut)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public editUser = async (req: Request, res: Response) => {
        try {
            const input: EditUserInputDTO = {
               idToEdit: req.params.id,
               token: req.headers.authorization,
               password: req.body.password
            }
               
            const outPut = await this.userBusinnes.editUser(input)

            res.status(200).send(outPut)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public deleteUser = async (req: Request, res: Response) => {
        try {
            const input: DeleteUserInputDTO = { 
                idToDelete: req.params.id,
                token: req.headers.authorization
            }

            const outPut = await this.userBusinnes.deleteUser(input)

            res.status(200).send(outPut)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

}