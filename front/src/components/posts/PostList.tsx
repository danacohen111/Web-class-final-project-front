import React, { useEffect, useState } from "react";
import Post from "./Post";
import Pagination from "../Pagination/Pagination";
import { IPost } from "../../models/models";
import "../../styles/postList.css";
import "../../styles/Pagination.css";

interface PostListProps {
  fetchPosts: () => Promise<IPost[]>;
  isInProfilePage: boolean;
  onDelete: (postId: string) => void;
}

const PostList: React.FC<PostListProps> = ({ fetchPosts, isInProfilePage, onDelete }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = isInProfilePage ? 2 : 3; 

  useEffect(() => {
    if (!fetchPosts) return;

    fetchPosts()
      .then(setPosts)
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts");
      });
  }, [fetchPosts]);

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const selectedPosts = posts.slice(startIndex, startIndex + postsPerPage);

  return (
    <>
      <div className="post-list">
        {error && <p className="error">{error}</p>}
        {selectedPosts.length > 0 ? (
          selectedPosts.map((post) => <Post key={post._id} post={post} isInProfilePage={isInProfilePage} onDelete={onDelete}/>)
        ) : (
          <p>No posts available.</p>
        )}
      </div>
      {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </>
  );
};

export default PostList;