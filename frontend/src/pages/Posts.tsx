import { Container, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import { fetchHandler, getPostOptions } from "../utils/utils";
import SearchBar from "../components/Posts/SearchBar";
import PostCard from "../components/Posts/PostCard";
import PostModal from "../components/Posts/PostModal";
import { Post } from "../utils/TypeProps";
import "../css/Posts.css";

const Posts = () => {
  const [posts, setPosts] = useState<Post[][]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPosts = async () => {
    const data = await fetchHandler(`/api/v1/posts?q=${searchTerm}`);
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, [searchTerm]);

  const handleCardClick = (post: Post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleReservation = async (
    event: React.FormEvent<HTMLFormElement>,
    reservationId: number
  ) => {
    event.preventDefault();
    await fetchHandler(`/api/v1/reservations/${reservationId}/select`, getPostOptions({}));
    fetchPosts();
  };

  return (
    <>
      <h1 className="posts-h1">Explore Posts</h1>
      <Container className="search mt-4">
        <SearchBar searchTerm={searchTerm} onSearchInputChange={handleSearchInputChange} />
      </Container>
      <Container className="posts mt-4">
        {posts.map((postOrArray, index) => {
          if (Array.isArray(postOrArray)) {
            return (
              <Row key={index}>
                {postOrArray.map((post) => (
                  <PostCard key={post.id} post={post} onClick={handleCardClick} />
                ))}
              </Row>
            );
          }
        })}
      </Container>
      <PostModal
        post={selectedPost}
        show={showModal}
        onHide={() => setShowModal(false)}
        handleReservation={handleReservation}
      />
      <footer className="footer fixed-bottom">
        <p className="footer-p text-center">&copy; 2024 Copyright: Ink</p>
      </footer>
    </>
  );
};

export default Posts;
