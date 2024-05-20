import React from "react";
import { Modal, Container, Row, Col, Carousel } from "react-bootstrap";
import { Post } from "../utils/TypeProps";

type PostModalProps = {
  post: Post | null;
  show: boolean;
  onHide: () => void;
  handleReservation: (event: React.FormEvent<HTMLFormElement>, reservationId: number) => void;
};

const PostModal: React.FC<PostModalProps> = ({ post, show, onHide, handleReservation }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{post?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            <Col>
              <Carousel>
                {post?.images.map((image, index) => (
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
              <p>Description: {post?.description}</p>
              <div className="d-flex flex-wrap">
                {post?.reservations
                  .filter((reservation) => reservation.free)
                  .map((reservation, index) => (
                    <form
                      key={index}
                      className="reservationForm"
                      onSubmit={(event) => handleReservation(event, reservation.id)}
                    >
                      <button type="submit" className="reservationBtn">
                        {new Date(reservation.pickup_time).toLocaleString()}
                      </button>
                    </form>
                  ))}
              </div>
              <p>Location: {post?.location}</p>
              <p>User ID: {post?.user_id}</p>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        {post?.reservations.some((reservation) => reservation.free) ? (
          <h4>Available</h4>
        ) : (
          <h4>Not Available</h4>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PostModal;
