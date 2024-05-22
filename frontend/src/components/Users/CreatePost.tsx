import { useState } from "react";
import { Modal, Container, Row, Button } from "react-bootstrap";
import { fetchHandler, getPostOptions } from "../../utils/utils";

type NewPostModalProps = {
  show: boolean;
  onHide: () => void;
};

const CreatPost: React.FC<NewPostModalProps> = ({ show, onHide }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [pickupTime, setPickupTime] = useState("");

  const handleNewPostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const postFormData = {
      title,
      description,
      location,
      images,
      pickup_times: [pickupTime],
    };
    await fetchHandler('/api/v1/posts/', getPostOptions(postFormData));
    onHide();
  };

  const bytesToBase64DataUrl = async (bytes: Uint8Array, type: string) => {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(new File([bytes], "", { type }));
    });
  };

  const dropHandler = async (event: React.DragEvent) => {
    event.preventDefault();
    for (const item of event.dataTransfer.items) {
      const file = item.getAsFile();
      if (file) {
        const encoded = await bytesToBase64DataUrl(
          new Uint8Array(await file.arrayBuffer()),
          file.type
        );
        setImages((images) => [...images, encoded]);
      }
    }
  };

  const dragOverHandler = (event: React.DragEvent) => {
    event.preventDefault();
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
              <input
                type="text"
                id="title"
                onChange={(e) => setTitle(e.target.value)}
                autoComplete="off"
              />
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="off"
              />
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                onChange={(e) => setLocation(e.target.value)}
                autoComplete="off"
              />
              <label htmlFor="images">Image:</label>
              <div
                id="drop_zone"
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
                style={{ border: '1px dashed black', padding: '20px', textAlign: 'center' }}
              >
                <p>Drag one or more files to this <i>drop zone</i>.</p>
              </div>
              <label htmlFor="pickupTime">Pickup Time:</label>
              <input
                type="datetime-local"
                id="pickupTime"
                onChange={(e) => setPickupTime(e.target.value)}
              />
              <Button type="submit">Submit Post</Button>
              <div>{images.map((img, i) => <img src={img} key={i} alt="Uploaded" />)}</div>
            </form>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default CreatPost;
