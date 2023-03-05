import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { SignupInputDTO, LoginInputDTO, GetUsersInputDTO, GetUsersOutputDTO, EditUserInputDTO, DeleteUserInputDTO } from "../dtos/UserDTO"
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { Role, TokenPayload, UserDB } from "../Types";
import { User } from "../models/UserModel";
import { UserDatabase } from "../database/UserDatabase";

export const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
export const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) { }

    public signupUser = async (input: SignupInputDTO) => {
        const { nickName, email, password } = input

        if (typeof nickName !== "string") {
            throw new BadRequestError("'nickName' deve ser string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (!email.match(regexEmail)) {
            throw new BadRequestError("'email' deve possuir letras minúsculas, deve ter um @, letras minúsculas, ponto (.) e de 2 a 4 letras minúsculas")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        if (!password.match(regexPassword)) {
            throw new BadRequestError("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial");
        }

        const id = this.idGenerator.generate()

        const passwordHash = await this.hashManager.hash(password)

        const newUser = new User(
            id,
            nickName,
            email,
            passwordHash,
            Role.NORMAL,
            new Date().toISOString()
        )

        const newUserDB = {
            id: newUser.getId(),
            nick_name: newUser.getNickName(),
            email: newUser.getEmail(),
            password: newUser.getPassword(),
            role: newUser.getRole(),
            created_at: newUser.getCreatedAt()
        }

        await this.userDatabase.insertUser(newUserDB)

        const tokenPayload: TokenPayload = {
            id: newUser.getId(),
            nickName: newUser.getNickName(),
            role: newUser.getRole()
        }

        const token = this.tokenManager.createToken(tokenPayload)

        const output = {
            token: token
        }

        return output
    }

    public loginUser = async (input: LoginInputDTO) => {
        const { email, password } = input

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        const userDB = await this.userDatabase.findUserByEmail(email)

        if (!userDB) {
            throw new NotFoundError("'email' não encontrado");
        }

        const user = new User(
            userDB.id,
            userDB.nick_name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        )

        const passwordHash = await this.hashManager.compare(password, userDB.password)

        if (!passwordHash) {
            throw new BadRequestError("'password' incorreto")
        }
        
        const payload: TokenPayload = {
            id: user.getId(),
            nickName: user.getNickName(),
            role: user.getRole()
        }

        const token = this.tokenManager.createToken(payload)

        const output = {
            token: token
        }

        return output
    }

    public getUsers = async (input: GetUsersInputDTO): Promise<GetUsersOutputDTO> => {
        const { token } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const usersDB = await this.userDatabase.getUsers()

        const users = usersDB.map((userDB) => {
            const user = new User (
                userDB.id,
                userDB.nick_name,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at
            )
            return user.toBusinessModel()
        })

        const output: GetUsersOutputDTO = users
        
        return output
    }

    public editUser = async (input: EditUserInputDTO): Promise<void> => {
        const { idToEdit, token, password } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token inválido");
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser uma string")
        }

        const newUserDB = await this.userDatabase.findUserById(idToEdit)

        if (!newUserDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const user = new User(
            newUserDB.id,
            newUserDB.nick_name,
            newUserDB.email,
            newUserDB.password,
            newUserDB.role,
            newUserDB.created_at
        )

        if (password !== undefined) {
            user.setPassword(password)
        }

        const updatedUserDB = user.toDBModel()

        await this.userDatabase.editUser(updatedUserDB, idToEdit)
    }

    public deleteUser = async (input: DeleteUserInputDTO) => {
        const { idToDelete, token } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("Usuário não está logado")
        }

        const userDBExists = await this.userDatabase.findUserById(idToDelete)

        if (!userDBExists) {
            throw new NotFoundError("usuário não encontrado");
        }

        const creatorId = payload.id

        if (payload.role !== Role.ADMIN && userDBExists.id !== creatorId) {
            throw new BadRequestError("somenste o próprio usuário pode deleta-lo");
        }

        await this.userDatabase.deleteUser(idToDelete)
    }
}