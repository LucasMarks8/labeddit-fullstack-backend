import { Request, Response } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { CreatePostInputDTO, DeletePostInputDTO, EditPostInputDTO, getPostCommentsInputDTO, GetPostsInputDTO, LikeOrDislikePostInputDTO } from "../dtos/PostDTO"
import { BaseError } from "../errors/BaseError"

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ) { }

    public getPosts = async (req: Request, res: Response) => {
        try {
            const input: GetPostsInputDTO = {
                token: req.headers.authorization
            }

            const output = await this.postBusiness.getPost(input)

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

    public getCommentByPostId = async (req: Request, res: Response) => {
        try {
            const input: getPostCommentsInputDTO = {
                id: req.params.id,
                token: req.headers.authorization
            }

            const output = await this.postBusiness.getCommentByPostId(input)

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

    public CreatePost = async (req: Request, res: Response) => {
        try {
            const input: CreatePostInputDTO = {
                token: req.headers.authorization,
                content: req.body.content
            }

            const output = await this.postBusiness.createPost(input)

            res.status(201).send(output)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public editPost = async (req: Request, res: Response) => {
        try {
            const input: EditPostInputDTO = {
                idToEdit: req.params.id,
                content: req.body.content,
                token: req.headers.authorization
            }

            const output = await this.postBusiness.editPost(input)

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

    public deletePost = async (req: Request, res: Response) => {
        try {
            const input: DeletePostInputDTO = { 
                idToDelete: req.params.id,
                token: req.headers.authorization
            }

            const output = await this.postBusiness.deletePost(input)

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

            const input: LikeOrDislikePostInputDTO = {
                idToLikeOrDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }
           
            await this.postBusiness.likeOrDislikePost(input)

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
