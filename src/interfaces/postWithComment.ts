import { Comment } from "./Comment";

export interface PostWithComments {
    id: number;
    title: string;
    content: string;
    authorId: number;
    comments:Comment[];
}