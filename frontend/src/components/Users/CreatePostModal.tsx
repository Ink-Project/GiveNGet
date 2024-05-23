import { useEffect } from "react";
import { Modal, Container, Row, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchHandler } from "../../utils/utils";
import { getPostOptions } from "../../utils/utils";
import { useEffect } from "react";

type CreatePostModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  description: string;
  location: string;
  reservations: string[];
  images: string[];
  onPostCreated: () => void;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  setReservations: React.Dispatch<React.SetStateAction<string[]>>;
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
    setTitle("");
    setDescription("");
    setLocation("");
    setImages([]);
    setReservations([]);
  };

  const dropHandler = async (event: React.DragEvent) => {
    event.preventDefault();
    for (const item of event.dataTransfer.items) {
      const file = item.getAsFile();
      if (file) {
        const encoded = await bytesToBase64DataUrl(
          new Uint8Array(await file.arrayBuffer()),
          file.type,
        );
        setImages((prevImages) => [...prevImages, encoded]);
      }
    }
  };

  const dragOverHandler = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const bytesToBase64DataUrl = async (bytes: Uint8Array, type: string) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(new File([bytes], "", { type }));
    });
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
            <Form.Group className="mb-3" controlId="image">
              <Form.Label>Image:</Form.Label>
              <Row>
                <div
                  id="drop_zone"
                  onDrop={dropHandler}
                  onDragOver={dragOverHandler}
                  style={{ border: "1px dashed black", padding: "20px", textAlign: "center" }}
                >
                  <p>
                    Drag one or more files to this <i>drop zone</i>.
                  </p>
                </div>
              </Row>
            </Form.Group>
            <Form.Group className="calendar mb-3" controlId="pickupTime">
              <Row>
                {reservations.map((reservation, index) => (
                  <div key={index} className="mb-3">
                    <DatePicker
                      selected={reservation ? new Date(reservation) : null}
                      onChange={(date) => {
                        const newReservations = [...reservations];
                        newReservations[index] = date ? date.toString() : "";
                        setReservations(newReservations);
                      }}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                    />
                  </div>
                ))}
                <Button
                  variant="primary"
                  onClick={() => {
                    setReservations([...reservations, new Date().toString()]);
                  }}
                >
                  Add Pickup Time
                </Button>
              </Row>
            </Form.Group>
            <Button type="submit" variant="success">
              Submit Post
            </Button>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePostModal;
