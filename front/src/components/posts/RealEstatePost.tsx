import React from "react";
import PostList from "../../components/posts/PostList";
import PostService from "../../services/post-service";
import "../../styles/RealEstatePost.css"; 

const RealEstatePosts: React.FC = () => {
  return (
    <div className="real-estate-container">
      <PostList fetchPosts={PostService.getAll} />
    </div>
  );
};

export default RealEstatePosts;
