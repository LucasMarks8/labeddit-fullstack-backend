export enum Role {
    ADMIN = "ADMIN",
    NORMAL = "NORMAL"
}

export interface TokenPayload {
    id: string,
    nickName: string,
    role: Role
}

export interface TokenPayload {
    id: string,
    role: Role
}

export interface PostModel {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    comments: number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        nickName: string
    }
}

export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    comments: number
    created_at: string,
    updated_at: string,
}

export interface CommentDB {
    id: string,
    post_id: string,
    user_id: string,
    comments: string,
    likes: number,
    dislikes: number,
    created_at: string
}

export interface PostWithCreatorDB extends PostDB {
    creator_nick_name: string
}

export interface CommentWithCreatorDB extends CommentDB {
    creator_nick_name: string
}

export interface UserModel {
    id: string,
    nickName: string,
    email: string,
    password: string,
    role: Role,
    createdAt: string
}

export interface CommentModel {
    id: string,
    postId: string,
    userId: string,
    comments: string,
    likes: number,
    dislikes: number,
    createdAt: string
}


export interface UserDB {
    id: string,
    nick_name: string,
    email: string,
    password: string,
    role: Role,
    created_at: string
}

export interface LikeDislikeDB {
    user_id: string,
    post_id: string,
    like: number
}

export interface LikeDislikeCommentDB {
    post_id: string,
    comment_id: string,
    user_id: string,
    like: number
}

export enum POST_LIKE {
    ALREADY_LIKED = "ALREADY LIKED",
    ALREADY_DISLIKED = "ALREADY DISLIKED"
}

export enum COMMENT_LIKE {
    ALREADY_LIKED = "ALREADY LIKED",
    ALREADY_DISLIKED = "ALREADY DISLIKED"
}


