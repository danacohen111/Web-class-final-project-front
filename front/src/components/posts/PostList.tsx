import React, { useEffect, useState } from "react";
import Post from "./Post";
import Pagination from "../Pagination/Pagination";
import { IPost } from "../../models/models";
import "../../styles/postList.css";
import "../../styles/Pagination.css";

interface PostListProps {
  fetchPosts: () => Promise<IPost[]>;
  isInProfilePage: boolean;
}

const PostList: React.FC<PostListProps> = ({ fetchPosts, isInProfilePage }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = isInProfilePage ? 2 : 3;

  const refreshPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Error fetching posts.");
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPosts();
  }, [fetchPosts]);

  const handleDelete = async (postId: string) => {
    setPosts(posts.filter((post) => post._id !== postId));
    await refreshPosts();
  };

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const selectedPosts = posts.slice(startIndex, startIndex + postsPerPage);

  return (
    <>
      <div className="post-list">
        {loading ? (
          <p>Loading posts...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : selectedPosts.length > 0 ? (
          selectedPosts.map((post) => (
            <Post
              key={post._id}
              post={post}
              isInProfilePage={isInProfilePage}
              onUpdate={refreshPosts}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default PostList;