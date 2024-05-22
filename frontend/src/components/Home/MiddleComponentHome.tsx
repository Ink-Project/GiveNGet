import { Container, Row, Col } from "react-bootstrap";
import Lottie from "lottie-react";
import environment from "../../images/animation/environment.json";
import recycle from "../../images/animation/recycle.json";
import savings from "../../images/animation/saving.json";

const MiddleComponentHome = () => {
  return (
    <>
      <h2 className="middleTitle">Our Initiative</h2>
      <Container className="middle-contain px-4 text-center">
        <Row className="gx-5 initiative-Container">
          <Col>
            <div
              className="p-3 initiative1"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lottie
                loop={true}
                animationData={environment}
                style={{ width: "300px", height: "300px" }}
              />
              <h4>Environmental Conservation</h4>
              <p>
                Second-hand items reduce demand for new goods, benefiting the environment by
                conserving resources and reducing waste
              </p>
            </div>
          </Col>
          <Col>
            <div
              className="p-3 initiative2"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lottie
                loop={true}
                animationData={recycle}
                style={{ width: "300px", height: "300px" }}
              />
              <h4>Waste Reduction</h4>
              <p>
                Opting for second-hand clothing decreases the volume of garments ending up in
                landfills, reducing environmental strain
              </p>
            </div>
          </Col>
          <Col>
            <div
              className="p-3 initiative3"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lottie
                loop={true}
                animationData={savings}
                style={{ width: "300px", height: "300px" }}
              />
              <h4>Financial Savings</h4>
              <p>
                Embracing second-hand options provides budget-friendly alternatives, allowing you to
                save money while supporting sustainability
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MiddleComponentHome;
