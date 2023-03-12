import { BaseDatabase } from "../../../src/database/BaseDatabase"
import { CommentDB, CommentWithCreatorDB, COMMENT_LIKE, LikeDislikeCommentDB, PostDB } from "../../../src/types"

export class CommentDatabaseMock extends BaseDatabase {
    public static TABLE_COMMENT = "comment"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"
    public static TABLE_COMMENT_LIKES_DISLIKES = "comment_likes_dislikes"

    public findCommentById = async (id: string): Promise<CommentDB | undefined> => {
        switch (id) {
            case "id-comment-mock":
                return {
                    id: "id-comment-mock",
                    post_id: "id-post-mock",
                    user_id: "id-mock",
                    comments: "primeiro comment mock",
                    likes: 0,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                }
            case "id-comment-mock2":
                return {
                    id: "id-comment-mock2",
                    post_id: "id-post-mock2",
                    user_id: "id-mock2",
                    comments: "segundo comment mock",
                    likes: 0,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                }
            default:
                return undefined
        }
    }

    public getCommentWithCreators = async (): Promise<CommentWithCreatorDB[]> => {
        return [
            {
                id: "id-comment-mock",
                post_id: "id-post-mock",
                user_id: "id-mock",
                comments: "primeiro comment mock",
                likes: 0,
                dislikes: 0,
                created_at: new Date().toISOString(),
                creator_nick_name: "Normal Mock"
            },
            {
                id: "id-comment-mock2",
                post_id: "id-post-mock2",
                user_id: "id-mock2",
                comments: "segundo comment mock",
                likes: 0,
                dislikes: 0,
                created_at: new Date().toISOString(),
                creator_nick_name: "Normal Mock"
            }
        ]
    }

    public findCommentWithPostId = async (id: string): Promise<CommentWithCreatorDB | undefined> => {
        switch (id) {
            case "id-post-mock":
                return {
                    id: "id-comment-mock",
                    post_id: "id-post-mock",
                    user_id: "id-mock",
                    comments: "primeiro comment mock",
                    likes: 0,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                    creator_nick_name: "Normal Mock"
                }
            case "id-post-mock2":
                return {
                    id: "id-comment-mock2",
                    post_id: "id-post-mock2",
                    user_id: "id-mock2",
                    comments: "segundo comment mock",
                    likes: 0,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                    creator_nick_name: "Normal Mock"
                }
            default:
                return undefined
        }
    }

    public insertComment = async (newCommentDB: CommentDB): Promise<void> => {
    }

    public updateComment = async (newCommentDB: CommentDB, id: string): Promise<void> => {
    }

    public deleteComment = async (id: string): Promise<void> => {
    }

    public findCommentWithCreatorById = async (id: string): Promise<CommentWithCreatorDB | undefined> => {
        switch (id) {
            case "id-mock":
                return {
                    id: "id-comment-mock",
                    post_id: "id-post-mock",
                    user_id: "id-mock",
                    comments: "primeiro comment mock",
                    likes: 0,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                    creator_nick_name: "Normal Mock"
                }
            case "id-mock2":
                return {
                    id: "id-comment-mock2",
                    post_id: "id-post-mock2",
                    user_id: "id-mock2",
                    comments: "segundo comment mock",
                    likes: 0,
                    dislikes: 0,
                    created_at: new Date().toISOString(),
                    creator_nick_name: "Normal Mock"
                }
            default:
                return undefined
        }
    }

    public likeOrDislikeComment = async (likeOrDislike: LikeDislikeCommentDB): Promise<void> => {
    }

    public findLikeDislike = async (likeOrDislikeDBToFind: LikeDislikeCommentDB): Promise<COMMENT_LIKE | null> => {

        if (likeOrDislikeDBToFind) {
            return likeOrDislikeDBToFind.like === 1
                ? COMMENT_LIKE.ALREADY_LIKED
                : COMMENT_LIKE.ALREADY_DISLIKED

        } else {
            return null
        }
    }

    public removeLikeDislike = async (likeOrDislike: LikeDislikeCommentDB): Promise<void> => {
    }

    public updateLikeDislike = async (likeOrDislike: LikeDislikeCommentDB): Promise<void> => {
    }
}