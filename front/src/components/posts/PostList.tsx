import React, { useEffect, useState } from "react";
import Post from "./Post";
import { IPost } from "../../services/post-service"; 
import "../../styles/postList.css";

interface PostListProps {
  fetchPosts: () => Promise<IPost[]>; 
}

const PostList: React.FC<PostListProps> = ({ fetchPosts }) => {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    fetchPosts().then(setPosts).catch(console.error);
  }, [fetchPosts]);

  return (
    <div className="post-list">
      {posts.length > 0 ? (
        <div className="post-grid">
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default PostList;
