import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/edit-profile");
  };

  return (
    <>
      <div>
        <button className="edit-profile" onClick={handleSubmit}>
          Edit Profile
        </button>
      </div>
      <div>
        <button className="delete-profile">Delete</button>
      </div>
    </>
  );
};

export default EditProfile;
