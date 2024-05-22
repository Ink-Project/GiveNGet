import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHandler, getPatchOptions } from "../../utils/utils";
import { Container } from "react-bootstrap";
import CurrentUserContext from "../../context/CurrentUserContext";

const EditProfileForm: React.FC = () => {
  const [newFullName, setNewFullName] = useState<string>("");
  const [newUserName, setNewUserName] = useState<string>("");
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      full_name: newFullName,
      username: newUserName,
    };
    try {
      const [user, error] = await fetchHandler(
        `api/v1/users/${currentUser?.id}`,
        getPatchOptions(data)
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
    <Container>
      <h1>Edit Profile</h1>
      <form onSubmit={handleUpdateProfile}>
        <label>Full Name</label>
        <input
          type="text"
          value={newFullName}
          onChange={(e) => setNewFullName(e.target.value)}
        />
        <label>Username</label>
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <button type="submit">Submit Update</button>
      </form>
      <button className="link-to-profile" onClick={linkToProfile}>Back to Profile</button>
    </Container>
  );
};

export default EditProfileForm;
