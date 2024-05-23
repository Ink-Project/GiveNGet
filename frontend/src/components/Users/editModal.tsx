import React, { useEffect } from "react";
import { Modal, Container, Row, Col, Button } from "react-bootstrap";
import { Post } from "../../utils/TypeProps";
import { fetchHandler } from "../../utils/utils";
import { getPatchOptions } from "../../utils/utils";

type EditModalProps = {
  show: boolean;
  onHide: () => void;
  post: Post;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
};

const EditModal: React.FC<EditModalProps> = ({ post, show, onHide }) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [location, setLocation] = React.useState("");

  useEffect(() => {
    if (show && post) {
      setTitle(post.title);
      setDescription(post.description);
      setLocation(post.location);
    }
  }, [show, post]);

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!post) {
      console.error("Post is null.");
      return;
    }
    const editFormData = {
      title,
      description,
      location,
    };
    await fetchHandler(`/api/v1/posts/${post.id}`, getPatchOptions(editFormData));
    onHide(); // Close the modal after submission
  };

  // Render nothing if post is null
  if (!post) {
    return null;
  }

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <form onSubmit={handleEditSubmit}>
            <Row className="mb-3">
              <Col xs={12}>
                <label htmlFor="title" className="form-label">Title:</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoComplete="off"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12}>
                <label htmlFor="description" className="form-label">Description:</label>
                <textarea
                  className="form-control"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  autoComplete="off"
                  style={{ height: "100px" }}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12}>
                <label htmlFor="location" className="form-label">Location:</label>
                <textarea
                  className="form-control"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  autoComplete="off"
                  style={{ height: "100px" }}
                />
              </Col>
            </Row>
            <div className="text-end">
              <Button type="submit">Submit Post</Button>
            </div>
          </form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default EditModal;
