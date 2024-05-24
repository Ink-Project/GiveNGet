import React from "react";
import { Card } from "react-bootstrap";
import { Post } from "../../utils/TypeProps";
import { imageUrl } from "../../utils/utils";

type PostCardProps = {
  post: Post;
  onClick: (post: Post) => void;
};

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <div className="col-md-3 mb-4" key={post.id}>
  <Card onClick={() => onClick(post)} style={{ height: "25rem" }}> {/* Set a fixed height for the card */}
    <Card.Img
      src={imageUrl(post.images[0])} // Display the first image
      alt="Placeholder"
      className="img-fluid"
      style={{ objectFit: "cover", maxHeight: "15rem" }} // Maintain aspect ratio for the image
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
