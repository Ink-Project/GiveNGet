import { Container } from "react-bootstrap";

const BottomHomeComponent = () => {
  return (
    <>
      <Container>
        <div className="top-section">
          <h1>How To Start</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum quam aspernatur,
            cupiditate dolores, esse quae excepturi itaque cum rem repellendus fuga accusamus, quos
            nam. Reprehenderit consequuntur sed eligendi cum illo.
          </p>
        </div>

        <div className="timeline">
          <div className="line">
            <div className="section">
              <div className="bead">
                <div className="content">
                  <h2>Browse Listings</h2>
                  <p>
                    Dive into the diverse listings of items available for donation on GiveNGet,
                    ranging from clothing and household items to electronics and furniture,
                    discovering the wide array of offerings waiting to find new homes.
                  </p>
                </div>
              </div>
            </div>

            <div className="section">
              <div className="bead">
                <div className="content">
                  <h2>Create An Account</h2>
                  <p>
                    Begin your journey with GiveNGet by signing up for an account, creating a
                    username and a password to access the platform's features and services.
                  </p>
                </div>
              </div>
            </div>

            <div className="section">
              <div className="bead">
                <div className="content">
                  <h2>List Your Items</h2>
                  <p>
                    Share your items on GiveNGet's donation listings, providing detailed
                    descriptions including images, pickup times, and locations to inform fellow
                    community members.
                  </p>
                </div>
              </div>
            </div>

            <div className="section">
              <div className="bead">
                <div className="content">
                  <h2>Exchange Items</h2>
                  <p>
                    Once your items are listed, Meet at the agreed location for item collection,
                    ensuring a smooth and convenient exchange process that aligns with your
                    preferences and availability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <h2 className="bottomTitle">How To Get Started</h2>
      <footer>© Copyright 2024 INK</footer>
    </>
  );
};

export default BottomHomeComponent;
