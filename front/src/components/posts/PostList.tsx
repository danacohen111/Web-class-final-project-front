import React, { useEffect, useState } from "react"; 
import Post from "./Post";
import { IPost } from "../../models/models";
import "../../styles/postList.css";

interface PostListProps {
  fetchPosts: () => Promise<IPost[]>;
}

const PostList: React.FC<PostListProps> = ({ fetchPosts }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fetchPosts) return;

    fetchPosts()
      .then(setPosts)
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts");
      });
  }, [fetchPosts]);

  return (
    <div className="post-list">
      {error && <p className="error">{error}</p>}
      {posts.length > 0 ? (
        posts.map((post) => ( 
          <Post key={post._id} post={post} /> 
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default PostList;
