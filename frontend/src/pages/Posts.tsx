import { fetchHandler } from "../utils";
import { useState, useEffect, useContext } from "react";
import CurrentUserContext from "../context/CurrentUserContext";
import { Navigate } from "react-router-dom";
import { Container, Row, Card, Modal, Col } from "react-bootstrap";

type Post = {
  id: number;
  title: string;
  description: string;
  location: string;
  user_id: number;
};

const Posts = () => {
  const [posts, setPosts] = useState<Post[][]>([]);
  const [images, setImages] = useState<Post[][]>([]);
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

  useEffect(() => {
    const fetchImages = async () => {
      const data = await fetchHandler("/api/v1/posts/images");
      setImages(data);
    };
    fetchImages();
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
                  <div className="col-md-3 mb-4" key={post.id}>
                    <Card onClick={() => handleCardClick(post)}>
                      <Card.Img
                        src="https://via.placeholder.com/150"
                        alt="Placeholder"
                        className="img-fluid w-100"
                      />
                      <Card.Body>
                        <Card.Title className="text-center">{post.title}</Card.Title>
                        <Card.Text>
                          {/* ID: {post.id}<br /> */}
                          Location: {post.location}
                          <br />
                          {/* Posted By: {post.user_id} */}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </Row>
            );
          }
        })}
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedPost?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row>
              <Col>
                <img
                  src="https://via.placeholder.com/150"
                  alt="Placeholder"
                  className="img-fluid"
                  style={{ maxWidth: "100%", height: "20rem" }}
                />
              </Col>
              <Col>
                <p>Description: {selectedPost?.description}</p>
                <p>Location: {selectedPost?.location}</p>
                <p>User ID: {selectedPost?.user_id}</p>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Posts;
