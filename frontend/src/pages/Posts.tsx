import { Container, Row, Alert } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { fetchHandler, getPostOptions } from "../utils/utils";
import SearchBar from "../components/Posts/SearchBar";
import PostCard from "../components/Posts/PostCard";
import PostModal from "../components/Posts/PostModal";
import { Post } from "../utils/TypeProps";
import FilterComponent from "../components/FilterComponent";
import CurrentUserContext from "../context/CurrentUserContext";
import "../css/Posts.css";

const Posts = () => {
  const [posts, setPosts] = useState<Post[][]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState("asc");
  const [limit, setLimit] = useState(10);
  const { currentUser } = useContext(CurrentUserContext);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const fetchPosts = async () => {
    const data = await fetchHandler(`/api/v1/posts?q=${searchTerm}&limit=${limit}&order=${order}`);
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, order, limit]);

  const handleOrderChange = (order: string) => {
    setOrder(order);
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };

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

    if (!currentUser) {
      // User must be logged in else, display an error message
      setAlertMessage("Please sign in to make a reservation.");
      setAlertVisible(true);
      return;
    }
    // User cant reserve their own post display an error message
    if (selectedPost && +selectedPost.user_id === +currentUser.id) {
      setAlertMessage("You cannot reserve your own post.");
      setAlertVisible(true);
      return;
    }
    await fetchHandler(`/api/v1/reservations/${reservationId}/select`, getPostOptions({}));
    fetchPosts();
  };

  return (
    <>
      {alertVisible && (
        <Alert style={{textAlign: "center"}} variant="danger" onClose={() => setAlertVisible(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
      <h1 className="posts-h1">Explore Posts</h1>
      <Container className="search mt-4">
        <SearchBar searchTerm={searchTerm} onSearchInputChange={handleSearchInputChange} />
      </Container>
      <FilterComponent onOrderChange={handleOrderChange} onLimitChange={handleLimitChange} />
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
      <footer className="footer">
        <p className="footer-p text-center">&copy; 2024 Copyright: Ink</p>
      </footer>
    </>
  );
};

export default Posts;
