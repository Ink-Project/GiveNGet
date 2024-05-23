import React, { useEffect } from "react";
import { Modal, Container, Row } from "react-bootstrap";
import { Post } from "../../utils/TypeProps";
import { fetchHandler } from "../../utils/utils";
import { getPatchOptions } from "../../utils/utils";

type PostModalProps = {
  post: Post;
  show: boolean;
  title: string;
  description: string;
  location: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  onHide: () => void;
};

const EditModal: React.FC<PostModalProps> = ({
  post,
  show,
  onHide,
  title,
  description,
  location,
  setTitle,
  setDescription,
  setLocation,
}) => {
  useEffect(() => {
    if (show && post) {
      setTitle(post.title);
      setDescription(post.description);
      setLocation(post.location);
    }
  }, [show, post, setTitle, setDescription, setLocation]);

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
    console.log(editFormData);
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
            <label htmlFor="title">Title:</label>
            <Row>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoComplete="off"
              />
            </Row>
            <label htmlFor="description">Description:</label>
            <Row>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="off"
              />
            </Row>
            <label htmlFor="location">Location:</label>
            <Row>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                autoComplete="off"
              />
            </Row>
            <button type="submit">Submit Post</button>
          </form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default EditModal;
