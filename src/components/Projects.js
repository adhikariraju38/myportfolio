import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import ZomecImg from "../assets/img/Zomec.png";
import MaiBertImg from "../assets/img/maiBert.png";
import ictcImg from "../assets/img/ictc.png";
import marketplace from "../assets/img/Nepali-Harvest.png";
import aiharvest from "../assets/img/aiharvest.png";
import portfolio from "../assets/img/portfolio.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import "animate.css";
import TrackVisibility from "react-on-screen";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

export const Projects = () => {
  const ref = useRef(null);
  const projectsRef = useRef(null);
  const projectsIsInView = useInView(projectsRef, {
    once: false,
    margin: "-200px",
  });
  const isInView = useInView(ref, { once: false, margin: "-200px" });
  const projects = [
    {
      title: "Zomec",
      description: "Design & Development",
      imgUrl: ZomecImg,
      url: "https://www.zomec.ai/",
    },
    {
      title: "MaiBERT",
      description: "Design & Development",
      imgUrl: MaiBertImg,
      url: "https://github.com/adhikariraju38/MaiBERT",
    },
    {
      title: "ICTC CMS",
      description: "Design & Development",
      imgUrl: ictcImg,
      url: "https://github.com/adhikariraju38/ICTC",
    },
    {
      title: "Agriculture Marketplace",
      description: "Design & Development",
      imgUrl: marketplace,
      url: "https://github.com/adhikariraju38/marketplace",
    },
    {
      title: "Nepali Harvest",
      description: "Design & Development",
      imgUrl: aiharvest,
      url: "https://github.com/adhikariraju38/Nepali_Harvest",
    },
    {
      title: "Portfolio",
      description: "Design & Development",
      imgUrl: portfolio,
      url: "https://github.com/adhikariraju38/myportfolio",
    },
  ];

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__fadeIn" : ""
                  }
                >
                  <h2>Projects</h2>
                  <motion.p
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    Welcome to my portfolio! I'm a passionate developer with a
                    robust skill set in crafting dynamic web applications.
                  </motion.p>
                  <motion.p
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 1.0, delay: 0.4 }}
                  >
                    Explore my projects below to witness the fusion of
                    innovation, functionality, and elegant design.
                  </motion.p>
                  <motion.div
                    ref={projectsRef}
                    initial={{ opacity: 0, x: 400 }} // Start off-screen to the right
                    animate={
                      projectsIsInView
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: 400 }
                    }
                    transition={{
                      type: "spring", // Use spring for bounce effect
                      stiffness: 100, // Controls the "bounciness"
                      damping: 10, // Controls how quickly it settles
                      duration: 1.2, // Optional: duration of the animation
                      delay: 0.3, // Delays the animation
                    }}
                  >
                    <Tab.Container id="projects-tabs" defaultActiveKey="first">
                      <Nav
                        variant="pills"
                        className="nav-pills mb-5 justify-content-center align-items-center"
                        id="pills-tab"
                      >
                        <Nav.Item>
                          <Nav.Link eventKey="first">Projects</Nav.Link>
                        </Nav.Item>
                        {/* <Nav.Item>
                      <Nav.Link eventKey="second">Tab 2</Nav.Link>
                    </Nav.Item> */}
                        {/* <Nav.Item>
                      <Nav.Link eventKey="third">Tab 3</Nav.Link>
                    </Nav.Item> */}
                      </Nav>

                      <Tab.Content
                        id="slideInUp"
                        className={
                          isVisible
                            ? "animate__animated animate__slideInUp"
                            : ""
                        }
                      >
                        <Tab.Pane eventKey="first">
                          <Row>
                            {projects.map((project, index) => {
                              return <ProjectCard key={index} {...project} />;
                            })}
                          </Row>
                        </Tab.Pane>
                        {/* <Tab.Pane eventKey="second">
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam, quod neque provident velit, rem explicabo excepturi id illo molestiae blanditiis, eligendi dicta officiis asperiores delectus quasi inventore debitis quo.</p>
                      <Row>
                        {
                          projects.map((project, index) => {
                            return (
                              <ProjectCard
                                key={index}
                                {...project}
                                />
                            )
                          })
                        }
                      </Row>
                    </Tab.Pane> */}
                        {/* <Tab.Pane eventKey="third">
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam, quod neque provident velit, rem explicabo excepturi id illo molestiae blanditiis, eligendi dicta officiis asperiores delectus quasi inventore debitis quo.</p>
                      <Row>
                        {
                          projects.map((project, index) => {
                            return (
                              <ProjectCard
                                key={index}
                                {...project}
                                />
                            )
                          })
                        }
                      </Row>
                    </Tab.Pane> */}
                      </Tab.Content>
                    </Tab.Container>
                  </motion.div>
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" alt = "" src={colorSharp2}></img>
    </section>
  );
};
