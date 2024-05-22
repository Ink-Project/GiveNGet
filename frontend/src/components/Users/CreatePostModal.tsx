import React from "react";
import { Modal, Container, Row } from "react-bootstrap";
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

  async function bytesToBase64DataUrl(bytes: Uint8Array, type: string) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(new File([bytes], "", { type }));
    });
  }

  async function dropHandler(event: React.DragEvent) {
    event.preventDefault();
    for (const item of event.dataTransfer.items) {
      const file = item.getAsFile();
      if (file) {
        const encoded = await bytesToBase64DataUrl(
          new Uint8Array(await file.arrayBuffer()),
          file.type
        );
        setImages((prevImages) => [...prevImages, encoded]);
      }
    }
  }

  function dragOverHandler(event: React.DragEvent) {
    event.preventDefault();
  }

  function addDatetimeField() {
    setReservations([...reservations, ""]);
  }

  const handleDatetimeChange = (index: number, value: string) => {
    const newReservations = [...reservations];
    newReservations[index] = value;
    setReservations(newReservations);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            <form onSubmit={handleNewPostSubmit}>
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
              <label htmlFor="image">Image:</label>
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
              <label htmlFor="pickupTime">Pickup Time:</label>
              <Row>
                {reservations.map((reservation, index) => (
                  <input
                    key={index}
                    type="datetime-local"
                    value={reservation}
                    onChange={(e) => handleDatetimeChange(index, e.target.value)}
                  />
                ))}
                <button type="button" onClick={addDatetimeField}>
                  Add Pickup Time
                </button>
              </Row>
              <br />
              <button type="submit">Submit Post</button>
              <div>
                {images.map((img, i) => (
                  <img src={img} key={i} alt={`uploaded ${i}`} />
                ))}
              </div>
            </form>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePostModal;
