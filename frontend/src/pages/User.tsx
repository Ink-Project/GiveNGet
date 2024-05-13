import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CurrentUserContext from "../context/CurrentUserContext";
import { getUser } from "../adapters/user-adapter";

type User = {
  id: string;
  username: string;
};

export default function UserPage() {
  const { currentUser } = useContext(CurrentUserContext);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const { id } = useParams();

  const isCurrentUserProfile = currentUser && Number(currentUser.id) === Number(id);

  useEffect(() => {
    const loadUser = async () => {
      if (id) {
        const [user, error] = await getUser(id);
        if (error) {
          return setErrorText(error.message);
        }
        setUserProfile(user);
      }
    };
    loadUser();
  }, [id]);

  if (!userProfile && !errorText) return null;
  if (errorText) return <p>{errorText}</p>;

  const profileUsername = isCurrentUserProfile ? currentUser.username : userProfile?.username;

  return (
    <>
      <h1>Hello {profileUsername}</h1>
      <p>Users Posts would be here</p>
      <p>Users can edit and delete their posts</p>
    </>
  );
}
