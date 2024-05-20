import { useContext, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import CurrentUserContext from "../context/CurrentUserContext";
import { getUser } from "../adapters/user-adapter";
import { fetchHandler, getPostOptions } from "../utils/utils";
import { Container, Row, Card, Modal, Col } from "react-bootstrap";

type User = {
 id: string;
 username: string;
}

type Post = {
 id: number;
 title: string;
 description: string;
 location: string;
 user_id: number;
};

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
 const [pickupTime, setPickupTime] = useState("")
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


 const handleNewPostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const postFormData = {
    "title": title,
    "description": description,
    "location": location,
    "images": images,
    "pickup_times": [pickupTime]
  };
  console.log(postFormData)
  await fetchHandler('/api/v1/posts/', getPostOptions(postFormData));
  
 }

 async function bytesToBase64DataUrl(bytes:Uint8Array, type:string) {
  return await new Promise<string>((resolve, reject) => {
    const reader = Object.assign(new FileReader(), {
      onload: () => resolve(reader.result as string),
      onerror: () => reject(reader.error),
    });
    reader.readAsDataURL(new File([bytes], "", { type }));
  });
}

async function dropHandler(event:React.DragEvent) {
  event.preventDefault();
  console.log(event);
  for (const item of event.dataTransfer.items) {
    const file = item.getAsFile();
    if (file === null) {
      continue;
    }

    const encoded = await bytesToBase64DataUrl(
      new Uint8Array(await file.arrayBuffer()),
      file.type
    );
    setImages((images) => [...images, encoded])
  }
}

function dragOverHandler(event:React.DragEvent) {
  event.preventDefault();
}


 return (
   <>
   <br />
     <h1>{profileUsername}'s Posts</h1>
     <br />
     <button type="button" className ="btn btn-outline-dark" onClick={showPostForm}> Create New Post</button>
     <br />
     <Container className="posts">
       {userPosts.map((postOrArray, index) => {
         if (Array.isArray(postOrArray)) {
           return (
             <Row key={index}>
               {postOrArray.map((post) => (
                 <div className="col-md-3 mb-4" key={post.id}>
                   <Card onClick={() => handleCardClick(post)}>
                     <Card.Img
                       src="https://via.placeholder.com/150"
                       alt="Placeholder"
                       className="img-fluid w-100"
                     />
                     <Card.Body>
                       <Card.Title className="text-center">{post.title}</Card.Title>
                       <Card.Text>
                         {/* ID: {post.id}<br /> */}
                         Location: {post.location}
                         <br />
                         {/* Posted By: {post.user_id} */}
                       </Card.Text>
                     </Card.Body>
                   </Card>
                 </div>
               ))}
             </Row>
           );
         }
       })}
     </Container>


     <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
       <Modal.Header closeButton>
         <Modal.Title>{selectedPost?.title}</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <Container fluid>
           <Row>
             <Col>
               <img
                 src="https://via.placeholder.com/150"
                 alt="Placeholder"
                 className="img-fluid"
                 style={{ maxWidth: "100%", height: "20rem" }}
               />
             </Col>
             <Col>
               <p>Description: {selectedPost?.description}</p>
               <p>Location: {selectedPost?.location}</p>
               <p>User ID: {selectedPost?.user_id}</p>
             </Col>
           </Row>
         </Container>
       </Modal.Body>
     </Modal>




     <Modal show={newPostModal} onHide={() => setNewPostModal(false)} centered size="lg">
       <Modal.Header closeButton>
         <Modal.Title>Create New Post</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <Container fluid>
           <Row>
               <form action="create-post" onSubmit={handleNewPostSubmit}>
                 <label htmlFor="floatingInput" >Title:</label>
                 <Row>
                 <input type="text" onChange={(e) => setTitle(e.target.value)} autoComplete="off" />
                 <label htmlFor="">Description:</label>
                 </Row>
                 <Row>
                 <input type="text" onChange={(e) => setDescription(e.target.value)} autoComplete="off"/>
                 <label htmlFor="">Location:</label>
                 </Row>
                 <Row>
                 <input onChange={(e) => setLocation(e.target.value)} autoComplete="off"/>
                 <label htmlFor="">Image:</label>
                 </Row>
                 <Row>
                 <div id="drop_zone" onDrop= {dropHandler} onDragOver= {dragOverHandler} style={{ border: '1px dashed black', padding: '20px', textAlign: 'center'}}>
                    <p>Drag one or more files to this <i>drop zone</i>.</p>
                  </div>
                 <label htmlFor="">Pickup Time:</label>
                 </Row>
                 <Row>
                 <input type="datetime-local" onChange={(e) => setPickupTime(e.target.value)} />
                 </Row>
                 <br />
                 <button>Submit Post</button>
                 <div>{images.map((img, i) => <img src={img} key={i} />)}</div>
               </form>
           </Row>
         </Container>
       </Modal.Body>
     </Modal>
   </>
 );
}
