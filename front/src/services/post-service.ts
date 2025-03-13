import apiClient from "./api-client";
import RealEstateService from "./realestate-service";
import { getUserById } from "./user-service";
import { IUser, IRealEstate, IPost } from "../models/models";

const PostService = {
  async getAll(): Promise<IPost[]> {
    const response = await apiClient.get<IPost[]>("/posts");
    const posts = response.data;

    const postsWithDetails: IPost[] = await Promise.all(
      posts.map(async (post) => {
        try {
          const userDetails: IUser | null = post.user ? await getUserById(post.user) : null;

          console.log(post.realestate);
          const realEstateDetails: IRealEstate | null = post.realestate
            ? await RealEstateService.getById(post.realestate)
            : null;

          return {
            ...post,
            sender: userDetails ?? { username: "Unknown", imgUrl: "/default-avatar.png", _id: "" },
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

    return postsWithDetails;
  },
};

export const createPost = async (postData: IPost) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await apiClient.post('/posts', postData, {
      headers: {
        "Authorization": `JWT ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export default PostService;
