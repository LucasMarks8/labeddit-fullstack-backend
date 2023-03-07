import { LikeDislikeCommentDB, CommentDB, COMMENT_LIKE, CommentWithCreatorDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class CommentDatabase extends BaseDatabase {

    public static TABLE_COMMENT = "comment"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"
    public static TABLE_COMMENT_LIKES_DISLIKES = "comment_likes_dislikes"

    public async findCommentById(id: string): Promise<CommentDB | undefined> {
        const result: CommentDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .select()
            .where({ id })

        return result[0]
    }

    public getCommentWithCreators = async (): Promise<CommentWithCreatorDB[]> => {
        const result: CommentWithCreatorDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .select(
                "comment.id",
                "comment.post_id",
                "comment.user_id",
                "comment.comments",
                "comment.likes",
                "comment.dislikes",
                "comment.created_at",
                "users.nick_name AS creator_nickName"
            )
            .join("users", "comment.user_id", "=", "users.id")

        return result
    }

    public findCommentWithPostId = async (
        commentId: string
    ): Promise<CommentWithCreatorDB | undefined> => {
        const result: CommentWithCreatorDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .select(
                "comment.id",
                "comment.post_id",
                "comment.user_id",
                "comment.comments",
                "comment.likes",
                "comment.dislikes",
                "comment.created_at",
                "post.id"
            )
            .join("posts", "comment.id", "=", "posts.id")
            .where("comment.id", commentId)

        return result[0]
    }

    public async insertComment(newCommentDB: CommentDB): Promise<void> {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .insert(newCommentDB)
    }

    public async updateComment(newCommentDB: CommentDB, id: string): Promise<void> {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .update(newCommentDB)
            .where({ id })
    }

    public async deleteComment(id: string): Promise<void> {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .delete()
            .where({ id })
    }

    public findCommentWithCreatorById = async (
       commentId: string
    ): Promise<CommentWithCreatorDB | undefined> => {
        const result: CommentWithCreatorDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .select(
                "comment.id",
                "comment.post_id",
                "comment.user_id",
                "comment.comments",
                "comment.likes",
                "comment.dislikes",
                "comment.created_at"
            )
            .join("users", "comment.user_id", "=", "users.id")
            .where("comment.id", commentId)

        return result[0]
    }

    public likeOrDislikeComment = async (likeDislike: LikeDislikeCommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .insert(likeDislike)
    }

    public findLikeDislike = async (likeDislikeDBToFind: LikeDislikeCommentDB): Promise<COMMENT_LIKE | null> => {
        const [likeDislikeDB]: LikeDislikeCommentDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .select()
            .where({
                post_id: likeDislikeDBToFind.post_id,
                user_id: likeDislikeDBToFind.user_id,
                comment_id: likeDislikeDBToFind.comment_id
            })

        if (likeDislikeDB) {
            return likeDislikeDB.like === 1
                ? COMMENT_LIKE.ALREADY_LIKED
                : COMMENT_LIKE.ALREADY_DISLIKED

        } else {
            return null
        }
    }

    public removeLikeDislike = async (likeDislikeDB: LikeDislikeCommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .delete()
            .where({
                post_id: likeDislikeDB.post_id,
                user_id: likeDislikeDB.user_id,
                comment_id: likeDislikeDB.comment_id
            })
    }

    public updateLikeDislike = async (likeDislikeDB: LikeDislikeCommentDB) => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT_LIKES_DISLIKES)
            .update(likeDislikeDB)
            .where({
                post_id: likeDislikeDB.post_id,
                user_id: likeDislikeDB.user_id,
                comment_id: likeDislikeDB.comment_id
            })
    }

}