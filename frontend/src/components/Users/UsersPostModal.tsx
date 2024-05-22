import { Modal, Container, Row, Col } from "react-bootstrap";
import { Post } from "../../utils/TypeProps";

type PostModalProps = {
  show: boolean;
  post: Post | null;
  onHide: () => void;
};

export default function UsersPostModal({ show, post, onHide }: PostModalProps) {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{post?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            <Col>
              <img
                src={`${window.location.origin}${post?.images[0]}`}
                alt="Placeholder"
                className="img-fluid"
                style={{ maxWidth: "100%", height: "20rem" }}
              />
            </Col>
            <Col>
              <p>Description: {post?.description}</p>
              <p>Location: {post?.location}</p>
              <p>User ID: {post?.user_id}</p>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <button>delete</button>
      </Modal.Footer>
    </Modal>
  );
}