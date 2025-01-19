import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Container, Row, Col, Button } from "react-bootstrap";
import headerImage from "../assets/img/final header.png";
import { ArrowRightCircle } from "react-bootstrap-icons";
import "animate.css";
import TrackVisibility from "react-on-screen";
import { BrowserRouter as Router } from "react-router-dom";

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-200px" });
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = [
    "FrontEnd Developer",
    "Backend Developer",
    "MERN Stack Developer",
  ];
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex((prevIndex) => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <Router>
      <section className="banner" id="home">
        <Container>
          <Row className="aligh-items-center">
            <Col xs={12} md={6} xl={7}>
              <TrackVisibility>
                {({ isVisible }) => (
                  <div
                    className={
                      isVisible ? "animate__animated animate__fadeIn" : ""
                    }
                  >
                    <span className="tagline">Welcome to my Portfolio</span>
                    <h1>
                      {`Hi! I'm Raju,`}{" "}
                      <span
                        className="txt-rotate"
                        dataPeriod="1000"
                        data-rotate='[ "Frontend Developer", "Backend Developer", "Full Stack Developer"]'
                      >
                        <span className="wrap">{text}</span>
                      </span>
                    </h1>
                    {console.log(isInView)}
                    <motion.p
                      ref={ref}
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                      }
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      A result-driven Computer Engineering graduate with a
                      fervent enthusiasm for ReactJS, ExpressJS, Next.js, and
                      MongoDB, coupled with expertise in Python Flask RESTful
                      API development and SQL. Proficient in full-stack
                      development, specializing in crafting efficient and
                      scalable web applications. Experienced in leveraging AWS
                      services, including EC2, Cognito, Lambda Functions, S3,
                      and Secrets Manager, to build secure and robust solutions.
                      A rapid learner with an avid appetite for mastering new
                      technologies, driven by a passion for delivering
                      high-quality results in dynamic environments.
                    </motion.p>
                    <div
                      style={{
                        display: "flex",
                        gap: "2rem",
                        alignItems: "center",
                      }}
                    >
                      <a
                        href="mailto:itsmeerajuyadav@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button
                          style={{
                            textDecoration: "none",
                            background: "transparent",
                            border: "1px solid #fff", // You can adjust the border color as needed
                            color: "#fff", // Adjust the text color as needed
                            padding: "10px 20px",
                            cursor: "pointer",
                          }}
                        >
                          Let’s Connect <ArrowRightCircle size={25} />
                        </button>
                      </a>
                      <a
                        href="https://drive.google.com/file/d/1mjFc68IvVbLGPBVB1EZsSwObVQO-FUiW/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          style={{
                            background: "transparent",
                            border: "1px solid #fff", // You can adjust the border color as needed
                            color: "#fff", // Adjust the text color as needed
                            padding: "10px 20px",
                            cursor: "pointer",
                          }}
                        >
                          View CV
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </TrackVisibility>
            </Col>
            <Col xs={12} md={6} xl={5}>
              <TrackVisibility>
                {({ isVisible }) => (
                  <div
                    className={
                      isVisible ? "animate__animated animate__zoomIn" : ""
                    }
                  >
                    <img src={headerImage} alt="Header Img" />
                  </div>
                )}
              </TrackVisibility>
            </Col>
          </Row>
        </Container>
      </section>
    </Router>
  );
};
