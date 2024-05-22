import { useNavigate } from "react-router-dom";
import { fetchHandler } from "../../utils/utils";
import { deleteOptions } from "../../utils/utils";
import CurrentUserContext from "../../context/CurrentUserContext";
import { useContext } from "react";

type EditProfileProps = {
  userId: string;
};

const EditProfile: React.FC<EditProfileProps> = ({ userId }) => {
  const { setCurrentUser } = useContext(CurrentUserContext);

  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/edit-profile");
  };

  const handleDelete = async () => {
    await fetchHandler(`/api/v1/users/${userId}`, deleteOptions);
    setCurrentUser(null);
    navigate("/login");
  };

  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

  const appendAlert = (message: string, type: string) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <div class="mt-3">',
      '     <button type="button" class="btn btn-danger me-2" id="confirmDelete">Yes, Delete</button>',
      '     <button type="button" class="btn btn-secondary" id="cancelDelete">No, Keep Profile</button>',
      "   </div>",
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder?.append(wrapper);

    document.getElementById("confirmDelete")?.addEventListener("click", () => {
      handleDelete();
      console.log("Profile deleted");
      wrapper.remove();
    });

    document.getElementById("cancelDelete")?.addEventListener("click", () => {
      console.log("Profile deletion cancelled");
      wrapper.remove(); 
    });
  };

  const alertTrigger = document.getElementById("liveAlertBtn");
  if (alertTrigger) {
    alertTrigger.addEventListener("click", () => {
      appendAlert("Are you sure you want to delete this profile?", "warning");
    });
  }
  return (
    <>
      <div>
        <button className="edit-profile" onClick={handleSubmit}>
          Edit Profile
        </button>
      </div>
      <div>
        <button className="delete-profile" id="liveAlertBtn">
          Delete
        </button>
        <div id="liveAlertPlaceholder"></div>
      </div>
    </>
  );
};

export default EditProfile;
