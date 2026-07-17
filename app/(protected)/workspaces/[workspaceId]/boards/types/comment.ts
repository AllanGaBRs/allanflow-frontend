export type Comment = {
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    taskId: string;
    createdAt: string;
}

export type CommentCreatePayload = {
    content: string;
}

export type CommentUpdatePayload = {
    content: string;
}