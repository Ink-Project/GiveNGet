import React, { useEffect } from "react";
import { Modal, Container, Row, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchHandler } from "../../utils/utils";
import { getPostOptions } from "../../utils/utils";

type CreatePostModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  description: string;
  location: string;
  reservations: Date[];
  images: string[];
  onPostCreated: () => void;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  setReservations: React.Dispatch<React.SetStateAction<Date[]>>;
};

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  show,
  onHide,
  title,
  description,
  location,
  images,
  reservations,
  setTitle,
  setDescription,
  setLocation,
  setImages,
  setReservations,
  onPostCreated,
}) => {
  useEffect(() => {
    if (show) {
      setTitle("");
      setDescription("");
      setLocation("");
      setImages([]);
      setReservations([]);
    }
  }, [show, setTitle, setDescription, setLocation, setImages, setReservations]);

  const handleNewPostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const postFormData = {
      title,
      description,
      location,
      images,
      pickup_times: reservations,
    };
    await fetchHandler("/api/v1/posts/", getPostOptions(postFormData));
    onPostCreated();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Form onSubmit={handleNewPostSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title:</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="location">
              <Form.Label>Location:</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="calendar mb-3" controlId="pickupTime">
              <Row>
                {reservations.map((reservation, index) => (
                  <div key={index} className="mb-3">
                    <DatePicker
                      selected={reservation}
                      onChange={(date: Date) => {
                        const newReservations = [...reservations];
                        newReservations[index] = date;
                        setReservations(newReservations);
                      }}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                    />
                    <button
                      onClick={() => {
                        const newReservations = [...reservations];
                        newReservations.splice(index, 1);
                        setReservations(newReservations);
                      }}
                      className="deleteTime"
                    >
                      x
                    </button>
                  </div>
                ))}
                <Button
                  variant="primary"
                  onClick={() => {
                    setReservations([...reservations, new Date()]);
                  }}
                >
                  Add Pickup Time
                </Button>
              </Row>
            </Form.Group>
            <Button type="submit" variant="success">Submit Post</Button>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePostModal;
