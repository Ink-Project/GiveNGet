import explore from "../../images/explore.svg";
import { Row, Col } from "react-bootstrap";

const PostsTopComponent = () => {
  return (
    <div className="beginning">
      <Row className="align-items-center">
        <Col className="left-column">
          <h1 className="postHeader">Explore Posts</h1>
          <p className="post-para">
            Explore a world of community giving right here in Brooklyn. Find items that match your
            interests and share them with others. Discover a variety of posts from generous
            neighbors near you.
          </p>
        </Col>
        <Col className="right-column offset-md-1">
          <img src={explore} alt="explore" className="explore" />
        </Col>
      </Row>
    </div>
  );
};

export default PostsTopComponent;
