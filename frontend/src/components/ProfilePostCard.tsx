import React from "react";
import { Card } from "react-bootstrap";
import { Post } from "../utils/TypeProps";

type PostCardProps = {
  post: Post;
  onClick: (post: Post) => void;
};

const handlePostRemoval = () => {
    console.log("working")
}

const handlePostEdit = () => {
    console.log("working")
}

const ProfilePostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <div className="col-md-3 mb-4" key={post.id}>
      <Card onClick={() => onClick(post)}>
        <Card.Img
          src={`${window.location.origin}${post.images[0]}`} // Display the first image
          alt="Placeholder"
          className="img-fluid w-100"
          style={{ maxWidth: "100%", height: "15rem" }}
        />
        <Card.Body>
          <Card.Title className="text-center">{post.title}</Card.Title>
          <Card.Text>Location: {post.location}</Card.Text>
          <div className="card-footer text-body-secondary">
            <div className="row">
                <div className="col text-start">
                <button className="btn btn-primary mr-2" onClick={handlePostRemoval}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg>
                </button>
                </div>
                <div className="col text-end">
                <button className="btn btn-secondary" onClick={handlePostEdit}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
</svg>
                </button>
                </div>
            </div>
            </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfilePostCard;
