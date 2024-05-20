import React from "react";
import { Card } from "react-bootstrap";
import { Post } from "../utils/TypeProps";

type PostCardProps = {
  post: Post;
  onClick: (post: Post) => void;
};

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
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
        </Card.Body>
      </Card>
    </div>
  );
};

export default PostCard;
