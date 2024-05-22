import { fetchHandler } from "../../utils/utils";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

type ProfileImageUploadProps = {
  userId: string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ userId }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
        const [userData, error] = await fetchHandler(`/api/v1/users/${userId}`);
        const imageUrl = userData.profile_image;
        setImageUrl(imageUrl);
        console.error('Error fetching user data:', error);
    };
    fetchImage();
  }, [userId]);
  
  return (
    <Container>
      <div className="profile-image-container">
        <img src={imageUrl || ''} alt="Profile Image" className="rounded-circle" />
      </div>
    </Container>
  );
}

export default ProfileImageUpload;
