import { useContext, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import CurrentUserContext from "../context/CurrentUserContext";
import { getUser } from "../adapters/user-adapter";
import { fetchHandler, getPostOptions } from "../utils/utils";
import { Container, Row } from "react-bootstrap";
import ProfilePostCard from "../components/ProfilePostCard";
import PostModal from "../components/PostModal";
import CreatePostModal from "../components/CreatePostModal";
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
 const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [reservations, setReservations] = useState<string[]>([])
 const { id } = useParams()

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
 }, [id])


 useEffect(()=>{
   const fetchUserPosts = async () => {
     const data = await fetchHandler(`/api/v1/posts?user=${id}`);
     setUserPosts(data);
   };
    fetchUserPosts();
 }, [id])


 if (!userProfile && !errorText) return null;
 if (errorText) return <p>{errorText}</p>;


 const profileUsername = isCurrentUserProfile ? currentUser.username : userProfile?.username;


 const handleCardClick = (post: Post) => {
   setSelectedPost(post);
   setShowModal(true);
 };


 const showPostForm = () => {
   setNewPostModal(true)
 }


 const handleReservation = async (
  event: React.FormEvent<HTMLFormElement>,
  reservationId: number
) => {
  event.preventDefault();
  await fetchHandler(`/api/v1/reservations/${reservationId}/select`, getPostOptions({}));
  // fetchPosts();
};



 return (
   <>
   <br />
     <h1>{profileUsername}'s Posts</h1>
     <br />
     <button type="button" className ="btn btn-outline-dark" onClick={showPostForm}> Create New Post</button>
     <br />
     <Container className="posts mt-4">
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
  setLocation = {setLocation}
  selectedPost={selectedPost!}
/>

        ))}
      </Row>
    );
  }
})}

      </Container>


      <PostModal
        post={selectedPost}
        show={showModal}
        onHide={() => setShowModal(false)}
        handleReservation={handleReservation}
      />

      <CreatePostModal
        post={selectedPost}
        title = {title}
        setTitle = {setTitle}
        location = {location}
        setLocation = {setLocation}
        description = {description}
        setDescription = {setDescription}
        images = {images}
        setImages = {setImages}
        reservations = {reservations}
        setReservations = {setReservations}
        show={newPostModal}
        onHide={() => setNewPostModal(false)}
        handleReservation={handleReservation}
      />

   </>
 );
}
