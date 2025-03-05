import React from "react";
import PostList from "../../components/posts/PostList";
import PostService from "../../services/post-service";

const RealEstatePosts: React.FC = () => {
  return <PostList fetchPosts={PostService.getAll} />;
};

export default RealEstatePosts;
