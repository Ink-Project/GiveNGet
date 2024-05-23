import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHandler, getPatchOptions } from "../../utils/utils";
import { Container, Form, Button } from "react-bootstrap";
import edit from "../../images/edit.svg"
import CurrentUserContext from "../../context/CurrentUserContext";

const EditProfileForm: React.FC = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const [newFullName, setNewFullName] = useState<string>(currentUser?.full_name || "");
  const [newUserName, setNewUserName] = useState<string>(currentUser?.username || "");

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      full_name: newFullName,
      username: newUserName,
    };
    try {
      const [user, error] = await fetchHandler(
        `api/v1/users/${currentUser?.id}`,
        getPatchOptions(data),
      );
      if (error) {
        console.error("Failed to update profile:", error);
      } else {
        setCurrentUser(user);
        navigate(`/users/${currentUser?.id}`);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const linkToProfile = () => {
    navigate(`/users/${currentUser?.id}`);
  };

  return (
    <>
    <Container>
      <div className="updateProlifeContainer">
      <h1 className="editH1">Edit Profile</h1>
      <Form onSubmit={handleUpdateProfile}>
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
        </Form.Group>
        <button className="submitUpdateProfile" type="submit" >Submit Update</button>
        <Button className="link-to-profile btn-warning" onClick={linkToProfile}>
        Back to Profile
      </Button>
      </Form>
      </div>
      <div>
        <img className="edit-image" src={edit} alt="editing picture" />
      </div>
    </Container>
    </>
  );
};

export default EditProfileForm;
