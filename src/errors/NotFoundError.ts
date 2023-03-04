import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
    constructor (
        message: string = "Requisição não encontrada"
    ) {
        super (404, message)
    }
}