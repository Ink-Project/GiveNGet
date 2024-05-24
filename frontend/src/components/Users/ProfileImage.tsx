import { fetchHandler, imageUrl } from "../../utils/utils";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import profile from "../../images/profile.svg"

type ProfileImageUploadProps = {
  userId: string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ userId }) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
        const [userData, error] = await fetchHandler(`/api/v1/users/${userId}`);
        setImage(imageUrl(userData.profile_image));
        console.error('Error fetching user data:', error);
    };
    fetchImage();
  }, [userId]);
  
  return (
    <Container>
      <div className="profile-image-container">
        <img src={image || profile} alt="Profile Image" />
      </div>
    </Container>
  );
}

export default ProfileImageUpload;
