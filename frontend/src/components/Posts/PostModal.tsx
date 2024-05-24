import React, {useEffect, useState} from "react";
import { Modal, Container, Row, Col, Carousel } from "react-bootstrap";
import { fetchHandler, imageUrl } from "../../utils/utils";
import { Post } from "../../utils/TypeProps";

type PostModalProps = {
  post: Post | null;
  show: boolean;
  onHide: () => void;
  handleReservation: (event: React.FormEvent<HTMLFormElement>, reservationId: number) => void;
};

const PostModal: React.FC<PostModalProps> = ({ post, show, onHide, handleReservation }) => {
  const [userName, setUserName] = useState("");

  useEffect(()=> {
    const loadUser = async () => {
      const data = await fetchHandler(`/api/v1/users/${post?.user_id}`);
      setUserName(data[0].full_name);
    };
    loadUser();
  })

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
                    <img src={imageUrl(image)} alt={`Image ${index + 1}`} className="img-fluid" />
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
              <p>Name: {userName}</p>
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
