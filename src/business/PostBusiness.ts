import { CommentDatabase } from "../database/CommentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { CreatePostInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostsInputDTO, GetPostsOutputDTO, LikeOrDislikePostInputDTO } from "../dtos/PostDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Post } from "../models/PostModel"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { LikeDislikeDB, PostWithCreatorDB, POST_LIKE, Role } from "../types"

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public getPost = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {

        const { token } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }


        const postsWithCreatorsDB: PostWithCreatorDB[] =
            await this.postDatabase.getPostsWithCreators()

        const posts = postsWithCreatorsDB.map((postWithCreatorDB) => {
            const post = new Post(
                postWithCreatorDB.id,
                postWithCreatorDB.content,
                postWithCreatorDB.likes,
                postWithCreatorDB.dislikes,
                postWithCreatorDB.comments,
                postWithCreatorDB.created_at,
                postWithCreatorDB.updated_at,
                postWithCreatorDB.creator_id,
                postWithCreatorDB.creator_nick_name
            )

            return post.toBusinessModel()
        })

        const output: GetPostsOutputDTO = posts

        return output
    }

    public getPostComment = async (input: GetPostsInputDTO) => {

        const { token } = input
        console.log(input);
        
        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const posts = await this.postDatabase.getPosts()

        const userDatabase = new UserDatabase()

        const users = await userDatabase.getUsers()

        const commentsDatabase = new CommentDatabase()

        const comments = await commentsDatabase.getCommentWithCreators()

        const resultPost = posts.map((post) => {

           const contador = comments.filter((comment) => {
                return comment.post_id === post.id
            })

            return {
                id: post.id,
                content: post.content,
                likes: post.likes,
                dislikes: post.dislikes,
                comments: contador.length,
                created_at: post.created_at,
                updated_at: post.updated_at,
                creator: resultUser(post.creator_id),
                cmt: contador
            }
        })

        function resultUser(user: string) {
            const resultTable = users.find((result) => {
                return user === result.id
            })

            return {
                id: resultTable?.id,
                name: resultTable?.nick_name
            }
        }

        return ({ Post: resultPost })
    }

    public createPost = async (input: CreatePostInputDTO): Promise<boolean> => {
        const { content, token } = input

        if (token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser uma string")
        }

        const id = this.idGenerator.generate()

        const newPost = new Post(
            id,
            content,
            0,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.nickName
        )

        const newPostDB = newPost.toDBModel()

        await this.postDatabase.insertPost(newPostDB)

        return true
    }

    public editPost = async (input: EditPostInputDTO): Promise<void> => {
        const { idToEdit, token, content } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token inválido");
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser uma string")
        }

        const newPostDB = await this.postDatabase.findPostById(idToEdit)
        console.log(newPostDB);

        if (!newPostDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (newPostDB.creator_id !== creatorId) {
            throw new BadRequestError("somente o criador do post pode editá-lo")
        }

        const creatorNickName = payload.nickName

        const post = new Post(
            newPostDB.id,
            newPostDB.content,
            newPostDB.likes,
            newPostDB.dislikes,
            newPostDB.comments,
            newPostDB.created_at,
            newPostDB.updated_at,
            creatorId,
            creatorNickName
        )

        post.setContent(content)
        post.setUpdatedAt(new Date().toISOString())

        const updatedPostDB = post.toDBModel()

        await this.postDatabase.updatePost(updatedPostDB, idToEdit)

    }

    public deletePost = async (input: DeletePostInputDTO): Promise<boolean> => {
        const { idToDelete, token } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("Usuário não está logado")
        }

        const postDBExists = await this.postDatabase.findPostById(idToDelete)

        if (!postDBExists) {
            throw new NotFoundError("'id' não existe")
        }

        const creatorId = payload.id

        if (payload.role !== Role.ADMIN && postDBExists.creator_id !== creatorId) {
            throw new BadRequestError("somente o criador do post pode deleta-lo");
        }


        await this.postDatabase.deletePost(idToDelete)

        return true
    }

    public likeOrDislikePost = async (input: LikeOrDislikePostInputDTO): Promise<boolean> => {
        const { idToLikeOrDislike, token, like } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser boolean")
        }

        const postWithCreatorDB = await this.postDatabase.findPostWithCreatorById(idToLikeOrDislike)

        if (!postWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const userId = payload.id
        const likeSQLite = like ? 1 : 0

        const likeDislikeDB: LikeDislikeDB = {
            user_id: userId,
            post_id: postWithCreatorDB.id,
            like: likeSQLite
        }

        const post = new Post(
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.comments,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.creator_nick_name
        )

        const likeDislikeExists = await this.postDatabase
            .findLikeDislike(likeDislikeDB)

        if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()
            }

        } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
            if (like) {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeDislike()
                post.addLike()
            } else {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislike()
            }

        } else {
            await this.postDatabase.likeOrDislikePost(likeDislikeDB)

            like ? post.addLike() : post.addDislike()
        }

        const updatedPostDB = post.toDBModel()

        await this.postDatabase.updatePost(updatedPostDB, idToLikeOrDislike)

        return true
    }
}
