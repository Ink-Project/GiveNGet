import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import QuotesCarousel from "./QuotesCarousel";

const BottomHomeComponent = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      <div className="aos">
        <div className="top-section" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
          <h1>How To Start</h1>
          <p>
            Ready to make a difference? Join GiveNGet and become part of a community dedicated to
            reducing waste and supporting those in need. Discover how you can contribute by listing
            your items for donation, browsing listings, and arranging exchanges with fellow
            community members. Let's work together to create positive change!
          </p>
        </div>

        <div className="timeline">
          <div className="line"></div>
          <div className="section" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="100">
            <div className="bead"></div>
            <div className="timeline-content">
              <h2 className="timeline-h2">Browse Listings</h2>
              <p className="timeline-p">
                Dive into the diverse listings of items available for donation on GiveNGet, ranging
                from clothing and household items to electronics and furniture, discovering the wide
                array of offerings waiting to find new homes.
              </p>
            </div>
            <span className="left-container-arrow"></span>
          </div>

          <div className="section" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="100">
            <div className="bead"></div>
            <div className="timeline-content">
              <h2 className="timeline-h2">Create An Account</h2>
              <p className="timeline-p">
                Begin your journey with GiveNGet by signing up for an account, creating a username
                and a password to access the platform's features and services.
              </p>
            </div>
            <span className="right-container-arrow"></span>
          </div>

          <div className="section" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="100">
            <div className="bead"></div>
            <div className="timeline-content">
              <h2 className="timeline-h2">List Your Items</h2>
              <p className="timeline-p">
                Share your items on GiveNGet's donation listings, providing detailed descriptions
                including images, pickup times, and locations to inform fellow community members.
              </p>
            </div>
            <span className="left-container-arrow"></span>
          </div>

          <div className="section" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="100">
            <div className="bead"></div>
            <div className="timeline-content">
              <h2 className="timeline-h2">Exchange Items</h2>
              <p className="timeline-p">
                Once your items are listed, Meet at the agreed location for item collection,
                ensuring a smooth and convenient exchange process that aligns with your preferences
                and availability.
              </p>
            </div>
            <span className="right-container-arrow"></span>
          </div>
        </div>
      </div>
      <QuotesCarousel />
      <footer className="footer">
        <p className="footer-p text-center">&copy; 2024 Copyright: Ink</p>
    </footer>
    </>
  );
};

export default BottomHomeComponent;
