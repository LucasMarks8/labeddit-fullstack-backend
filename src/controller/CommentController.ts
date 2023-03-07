import { Request, Response } from "express"
import { CommentBusiness } from "../business/CommentBusiness"
import { CreateCommentInputDTO, DeleteCommentInputDTO, EditCommentInputDTO, GetCommentInputDTO, GetCommentOutputDTO, GetCommentsInputDTO, LikeOrDislikeCommentInputDTO } from "../dtos/CommentDTO"
import { BaseError } from "../errors/BaseError"


export class CommentController {
    constructor(
        private commentBusiness: CommentBusiness,
    ) { }

    public getComment = async (req: Request, res: Response) => {
        try {
            const input: GetCommentsInputDTO = {
                token: req.headers.authorization
            }

            const output = await this.commentBusiness.getComment(input)

            res.status(200).send(output)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public getCommentById = async (req: Request, res: Response) => {
        try {
            const input: GetCommentInputDTO = {
                idToSearch: req.params.id,
                token: req.headers.authorization
            }

            const output = await this.commentBusiness.getCommentById(input)

            res.status(200).send(output)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public CreateComment = async (req: Request, res: Response) => {
        try {
            const input: CreateCommentInputDTO = {
                postId: req.params.id,
                token: req.headers.authorization,
                comments: req.body.comments
            }
            console.log(input.postId);
            
            await this.commentBusiness.createComment(input)
            
            res.status(201).end()
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public editComment = async (req: Request, res: Response) => {
        try {
            const input: EditCommentInputDTO = {
                idToEdit: req.params.id,
                comments: req.body.comments,
                token: req.headers.authorization
            }

            const output = await this.commentBusiness.editComment(input)

            res.status(200).send(output)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public deleteComment = async (req: Request, res: Response) => {
        try {
            const input: DeleteCommentInputDTO = { 
                idToDelete: req.params.id,
                token: req.headers.authorization
            }

            const output = await this.commentBusiness.deleteComment(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public likeDislike = async (req: Request, res: Response) => {
        try {

            const input: LikeOrDislikeCommentInputDTO = {
                idToLikeOrDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }
           
            await this.commentBusiness.likeOrDislikeComment(input)

            res.status(200).end()
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
