import { Row, Col } from "react-bootstrap";
import trade from "../../images/trade.svg"
import wave from "../../images/wave.svg";

const TopComponentHome = () => {
  return (
    <>
      <div className="beginning">
        <Row className="align-items-center">
          <Col className="left-column">
            <h1 className="header1">Share & buy nothing</h1>
            <h1 className="header2">Discover abundance</h1>
            <p className="left-para">
              Our platform fosters the exchange of items you no longer need with those who could
              benefit from them. Whether it's clothing or appliances, we provide a space for
              you to freely give away your unused items and connect with someone who will truly
              value them.
            </p>
          </Col>
          <Col className="right-column offset-md-1">
            <img src={trade} alt="People trading" />
          </Col>
        </Row>
      </div>
      <img src={wave} alt="wave" />
    </>
  );
};

export default TopComponentHome;
