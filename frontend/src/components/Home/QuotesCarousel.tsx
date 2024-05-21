import { Container, Carousel } from "react-bootstrap";

const QuotesCarousel = () => {
  return (
    <Container className="quotes-carousel">
      <Carousel>
        <Carousel.Item>
          <div
            className="quote-container d-flex flex-column align-items-center justify-content-center mx-auto"
            style={{
              height: "300px",
              backgroundColor: "#eff0ff",
              padding: "2rem",
              borderRadius: "30px",
            }}
          >
            <p className="quote-p">
              "Building GiveNGet has been an incredible journey. I can't wait to see how it will
              help reduce waste and bring communities together."
            </p>
            <p className="text-muted">- GiveNGet Developers</p>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div
            className="quote-container d-flex flex-column align-items-center justify-content-center mx-auto"
            style={{
              height: "300px",
              backgroundColor: "#e3f3ff",
              padding: "2rem",
              borderRadius: "30px",
            }}
          >
            <p className="quote-p">
              "Developing GiveNGet has shown me the power of community support. I'm excited to see
              how it will enable people to share and give back in ways they never imagined."
            </p>
            <p className="text-muted">- GiveNGet Developers</p>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div
            className="quote-container d-flex flex-column align-items-center justify-content-center mx-auto"
            style={{
              height: "300px",
              backgroundColor: "#e9f5e4",
              padding: "2rem",
              borderRadius: "30px",
            }}
          >
            <p className="quote-p">
              "Creating GiveNGet has been a labor of love. I'm looking forward to the day it
              connects people through generosity and helps build a more sustainable future."
            </p>
            <p className="text-muted">- GiveNGet Developers</p>
          </div>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
};

export default QuotesCarousel;
