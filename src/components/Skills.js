import meter1 from "../assets/img/meter1.svg";
import meter2 from "../assets/img/meter2.svg";
import meter3 from "../assets/img/meter3.svg";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import colorSharp from "../assets/img/color-sharp.png";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

export const Skills = () => {
  const ref = useRef(null);
  const carouselRef = useRef(null);
  const carouselIsInView = useInView(carouselRef, {
    once: false,
    margin: "200px",
  });
  const isInView = useInView(ref, { once: false, margin: "200px" });
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 7,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <section className="skill" id="skills">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="skill-bx wow zoomIn">
              <h2>Skills</h2>
              <motion.p
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Welcome to my Skills section, where I showcase expertise in
                React.js, Express.js, Next.js, HTML, CSS, Bootstrap, Tailwind
                CSS, and Material-UI. I am also proficient in Python Flask
                (RESTful APIs), SQL, and leveraging AWS services such as EC2,
                Cognito, Lambda Functions, S3, and Secrets Manager. These
                technologies enable me to craft dynamic, responsive, and
                scalable web applications with efficiency, precision, and a
                focus on delivering high-quality solutions.
              </motion.p>
              <div style={{ position: "relative", overflow: "auto" }}>
                <motion.div
                  ref={carouselRef}
                  initial={{ opacity: 0, x: -150 }} // Start off-screen to the right
                  animate={
                    carouselIsInView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -150 }
                  }
                  transition={{
                    type: "spring", // Use spring for bounce effect
                    stiffness: 100, // Controls the "bounciness"
                    damping: 10, // Controls how quickly it settles
                    duration: 1.2, // Optional: duration of the animation
                    delay: 0.3, // Delays the animation
                  }}
                >
                  <Carousel
                    responsive={responsive}
                    infinite={true}
                    className="owl-carousel owl-theme skill-slider"
                    ssr={true}
                    autoPlay={true}
                    autoPlaySpeed={1000}
                    keyBoardControl={true}
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    containerClass="carousel-container"
                  >
                    <div className="item">
                      <img src={meter1} alt="" />
                      <h5>Python, Flask Restful</h5>
                    </div>
                    <div className="item">
                      <img src={meter3} alt="" />
                      <h5>ReactJS Development</h5>
                    </div>
                    <div className="item">
                      <img src={meter2} alt="" />
                      <h5>NEXTJS Development</h5>
                    </div>
                    <div className="item">
                      <img src={meter2} alt="" />
                      <h5>ExpressJS Development</h5>
                    </div>
                    <div className="item">
                      <img src={meter1} alt="" />
                      <h5>HTML</h5>
                    </div>
                    <div className="item">
                      <img src={meter3} alt="" />
                      <h5>CSS</h5>
                    </div>
                    <div className="item">
                      <img src={meter3} alt="" />
                      <h5>TailwindCSS, MaterialUi</h5>
                    </div>
                    <div className="item">
                      <img src={meter2} alt="" />
                      <h5>BootStrap</h5>
                    </div>
                  </Carousel>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img className="background-image-left" src={colorSharp} alt="" />
    </section>
  );
};
