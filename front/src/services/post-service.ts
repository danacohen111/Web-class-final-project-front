import apiClient from "./api-client";
import RealEstateService from "./realestate-service";
import { getUserById } from "./user-service";
import { IUser, IRealEstate, IPost } from "../models/models";

const fetchPostsWithDetails = async (posts: IPost[]): Promise<IPost[]> => {
  return await Promise.all(
    posts.map(async (post) => {
      try {
        const userDetails: IUser | null = post.user ? await getUserById(post.user) : null;
        const realEstateDetails: IRealEstate | null = post.realestate
          ? await RealEstateService.getById(post.realestate)
          : null;

        return {
          ...post,
          sender: userDetails ?? { username: "Unknown", imgUrl: null, _id: "" },
          realEstateDetails: realEstateDetails ?? {
            city: "Unknown City",
            address: "No Address",
            owner: "Unknown Owner",
            description: "No Description",
            area: "N/A",
            location: "",
            _id: "",
          },
        } as IPost;
      } catch (error) {
        console.error("Error fetching post details:", error);
        return post;
      }
    })
  );
};

const PostService = {
  async getAll(): Promise<IPost[]> {
    const response = await apiClient.get<IPost[]>("/posts");
    const posts = response.data;
    return await fetchPostsWithDetails(posts);
  },

  async getPostsByUser(userId: string): Promise<IPost[]> {
    const response = await apiClient.get<IPost[]>(`/posts?user=${userId}`);
    const posts = response.data;
    return await fetchPostsWithDetails(posts);
  },

  async deletePost(postId: string): Promise<void> {
    try {
      await apiClient.delete(`/posts/${postId}`);
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  async updatePost(postId: string, updatedPost: Partial<IPost>): Promise<IPost> {
    try {
      const response = await apiClient.put<IPost>(`/posts/${postId}`, updatedPost);
      return response.data;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  }
};

export const createPost = async (postData: IPost) => {
  try {
    const response = await apiClient.post<IPost>('/posts', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export default PostService;