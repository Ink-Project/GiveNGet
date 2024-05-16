import { Container, Row, Card, Modal, Col, Carousel, Form } from "react-bootstrap";
import CurrentUserContext from "../context/CurrentUserContext";
import { useState, useEffect, useContext } from "react";
import { fetchHandler } from "../utils/utils";
import { Navigate } from "react-router-dom";
import { Post } from "../utils/TypeProps";

const Posts = () => {
  // Making sure that a user is logged in
  // const { currentUser } = useContext(CurrentUserContext);
  // if (!currentUser) return <Navigate to="/login" />;

  const [posts, setPosts] = useState<Post[][]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await fetchHandler(`/api/v1/posts?q=${searchTerm}`);
      setPosts(data);
    };

    fetchPosts();
  }, [searchTerm]);

  // Function to handle when a card is clicked
  const handleCardClick = (post: Post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  // Function to handle search input change
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <h1>Posts</h1>

      <Container className="search mt-4">
        <Form>
          <div className="form-floating">
            <Form.Control
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
            <label htmlFor="search" className="form-label">
              Search
            </label>
          </div>
        </Form>
      </Container>

      <Container className="posts  mt-4">
        {posts.map((postOrArray, index) => {
          if (Array.isArray(postOrArray)) {
            return (
              <Row key={index}>
                {postOrArray.map((post) => (
                  <div className="col-md-3 mb-4" key={post.id}>
                    <Card onClick={() => handleCardClick(post)}>
                      <Card.Img
                        src={`${window.location.origin}${post.images[0]}`} // Display the first image
                        alt="Placeholder"
                        className="img-fluid w-100"
                        style={{ maxWidth: "100%", height: "15rem" }}
                      />
                      <Card.Body>
                        <Card.Title className="text-center">{post.title}</Card.Title>
                        <Card.Text>Location: {post.location}</Card.Text>
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
                <Carousel>
                  {selectedPost?.images.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        src={`${window.location.origin}${image}`}
                        alt={`Image ${index + 1}`}
                        className="img-fluid"
                        style={{ maxWidth: "100%", height: "15rem" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </Col>

              <Col>
                <p>Description: {selectedPost?.description}</p>
                {selectedPost?.reservations.some((reservation) => reservation.free) && (
                  <>
                    <p>Pickup Time: </p>
                    {selectedPost?.reservations.map((reservation, index) => (
                      <button key={index} className="reservationBtn">
                        {new Date(reservation.pickup_time).toLocaleString()}
                      </button>
                    ))}
                  </>
                )}
                <Row>
                  <Col>

                    <p>Location: {selectedPost?.location}</p>
                    <p>User ID: {selectedPost?.user_id}</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Body>

        {selectedPost?.reservations.some((reservation) => reservation.free) ? (
          <button className="btn btn-primary">Reserve</button>
        ) : (
          <button className="btn btn-primary" disabled>
            Not Available
          </button>
        )}
        
      </Modal>
    </>
  );
};

export default Posts;
