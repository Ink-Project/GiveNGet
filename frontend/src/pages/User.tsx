import { useContext, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import CurrentUserContext from "../context/CurrentUserContext";
import { getUser } from "../adapters/user-adapter";
import { fetchHandler, getPostOptions } from "../utils/utils";
import { Post } from "../utils/TypeProps";
import ProfilePostCard from "../components/Users/ProfilePostCard";
import PostModal from "../components/Posts/PostModal";
import CreatePostModal from "../components/Users/CreatePostModal";
import ProfileImage from "../components/Users/ProfileImage";
import EditProfile from "../components/Users/EditProfile";
import "../css/Users.css";

type User = {
  id: string;
  username: string;
};

export default function UserPage() {
  const { currentUser } = useContext(CurrentUserContext);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[][]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newPostModal, setNewPostModal] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [reservations, setReservations] = useState<string[]>([]);
  const { id } = useParams();

  if (!currentUser) return <Navigate to="/login" />;

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

  const fetchUserPosts = async () => {
    const data = await fetchHandler(`/api/v1/posts?user=${id}`);
    setUserPosts(data);
  };

  useEffect(() => {
    fetchUserPosts();
  }, [id]);

  if (!userProfile && !errorText) return null;
  if (errorText) return <p>{errorText}</p>;

  const profileUsername = isCurrentUserProfile ? currentUser.username : userProfile?.username;

  const handleCardClick = (post: Post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const showPostForm = () => {
    setNewPostModal(true);
  };

  const handleReservation = async (
    event: React.FormEvent<HTMLFormElement>,
    reservationId: number
  ) => {
    event.preventDefault();
    await fetchHandler(`/api/v1/reservations/${reservationId}/select`, getPostOptions({}));
  };

  return (
    <>
      <Container className="mt-4">
        <Row>
          <Col className="userProfile">
            {id && userProfile && <ProfileImage userId={id} />}
            <h3>Username: {profileUsername}</h3>
            <div className="simpleLine"></div>
            <EditProfile />
          </Col>

          <Col className="col-md-8">
            <div className="userContent">
              <h2 className="profile-h2">Profile</h2>
              <button type="button" className="create-post" onClick={showPostForm}>
                Create New Post
              </button>
            </div>
            <div className="seperater"></div>
            <Container className="usersPost">
              {userPosts.map((postOrArray, index) => {
                if (Array.isArray(postOrArray)) {
                  return (
                    <Row key={index}>
                      {postOrArray.map((post) => (
                        <ProfilePostCard
                          key={post.id}
                          post={post}
                          onClick={handleCardClick}
                          title={title}
                          description={description}
                          location={location}
                          setTitle={setTitle}
                          setDescription={setDescription}
                          setLocation={setLocation}
                          selectedPost={selectedPost!}
                        />
                      ))}
                    </Row>
                  );
                }
              })}
            </Container>
          </Col>
        </Row>
      </Container>

      <PostModal
        post={selectedPost}
        show={showModal}
        onHide={() => setShowModal(false)}
        handleReservation={handleReservation}
      />

      <CreatePostModal
        show={newPostModal}
        onHide={() => setNewPostModal(false)}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        location={location}
        setLocation={setLocation}
        images={images}
        setImages={setImages}
        reservations={reservations}
        setReservations={setReservations}
        onPostCreated={fetchUserPosts}
      />
      <footer className="footer">
        <p className="footer-p text-center">&copy; 2024 Copyright: Ink</p>
      </footer>
    </>
  );
}
