import apiClient from "./api-client";
import { IComment } from "../models/models";

const CommentService = {
  async getCommentsByPost(postId: string): Promise<IComment[]> {
    const response = await apiClient.get<IComment[]>(`/comments?post=${postId}`);
    return response.data;
  },

  async addComment(postId: string, userId: string, content: string): Promise<IComment>
   {
    const response = await apiClient.post<IComment>("/comments", {
      post: postId,
      user: userId,
      content,
    });
    return response.data;
  },
};

export default CommentService;
