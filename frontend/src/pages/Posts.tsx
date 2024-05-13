import { fetchHandler } from "../utils";
import { useState, useEffect, useContext } from "react";
import CurrentUserContext from "../context/CurrentUserContext";
import { Navigate } from "react-router-dom";
import { Container, Row, Card, Modal } from "react-bootstrap";

type Post = {
  id: number;
  title: string;
  description: string;
  location: string;
  user_id: number;
};

const Posts = () => {
  const [posts, setPosts] = useState<Post[][]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false); 
  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await fetchHandler("/api/v1/posts");
      setPosts(data);
    };

    fetchPosts();
  }, []);

  if (!currentUser) return <Navigate to="/login" />;

  // Function to handle when a card is clicked
  const handleCardClick = (post: Post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  return (
    <>
      <h1>Posts</h1>
      <Container className="posts">
        {posts.map((postOrArray, index) => {
          if (Array.isArray(postOrArray)) {
            return (
              <Row key={index}>
                {postOrArray.map((post) => (
                  <div className="col-md-4 mb-4" key={post.id}>
                    <Card onClick={() => handleCardClick(post)}>
                      <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>
                          {/* ID: {post.id}<br /> */}
                          Location: {post.location}<br />
                          {/* Posted By: {post.user_id} */}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </Row>
            );
          }
          return null;
        })}
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedPost?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Description: {selectedPost?.description}</p>
          <p>Location: {selectedPost?.location}</p>
        </Modal.Body>
      </Modal>

    </>
  );
};

export default Posts;