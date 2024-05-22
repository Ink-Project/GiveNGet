import { useContext, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Container, Row, Button } from "react-bootstrap";
import CurrentUserContext from "../context/CurrentUserContext";
import { getUser } from "../adapters/user-adapter";
import { fetchHandler } from "../utils/utils";
import PostCard from "../components/Posts/PostCard"
import UsersPostModal from "../components/Users/UsersPostModal";
import CreatePost from "../components/Users/CreatePost";
import { Post } from "../utils/TypeProps";

type User = {
  id: string;
  username: string;
}

export default function UserPage() {
  const { currentUser } = useContext(CurrentUserContext);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[][]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newPostModal, setNewPostModal] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
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
    }
    loadUser();
  }, [id]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const data = await fetchHandler(`/api/v1/posts?user=${id}`);
      setUserPosts(data);
    };
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

  return (
    <>
      <br />
      <h1>{profileUsername}'s Posts</h1>
      <br />
      <Button variant="outline-dark" onClick={showPostForm}>Create New Post</Button>
      <br />
      <Container className="posts">
        {userPosts.map((postOrArray, index) => {
          if (Array.isArray(postOrArray)) {
            return (
              <Row key={index}>
                {postOrArray.map((post) => (
                  <PostCard post={post} onClick={handleCardClick} key={post.id} />
                ))}
              </Row>
            );
          }
        })}
      </Container>
      <UsersPostModal show={showModal} post={selectedPost} onHide={() => setShowModal(false)} />
      <CreatePost show={newPostModal} onHide={() => setNewPostModal(false)} />
      <footer className="footer fixed-bottom">
        <p className="footer-p text-center">&copy; 2024 Copyright: Ink</p>
      </footer>
    </>
  );
}
