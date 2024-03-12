"use client";

import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

type CapacityData = {
  uuid: string;
  current: number;
  value: number;
};

type CourseData = {
  uuid: string;
  code: string;
  owner: string;
  description: string;
};

const Home = () => {
  const [courseData, setCourseData] = useState<CourseData[]>();
  const [capacityData, setCapacityData] = useState<CapacityData[]>();
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>();
  const router = useRouter();

  useEffect(() => {
    axios
      .get("api/course/all", { withCredentials: true })
      .then((res) => {
        // console.log(res.data);
        setCourseData(res.data);
      })
      .catch((error) => {
        console.log(error);
        router.push("/login");
      });

    axios
      .get("api/enrollment/capacity/all", { withCredentials: true })
      .then((res) => {
        // console.log(res.data);
        setCapacityData(res.data);
      })
      .catch((error) => {
        console.log(error);
        router.push("/login");
      });

    axios
      .get("api/enrollment/enroll/enrolled", { withCredentials: true })
      .then((res) => {
        // console.log(res.data);
        setEnrolledCourses(res.data);
      })
      .catch((error) => {
        console.log(error);
        router.push("/login");
      });
  }, []);

  const handelEnroll = (uuid: string) => {
    axios
      .post("api/enrollment/enroll", { uuid }, { withCredentials: true })
      .then((res) => {
        alert("enrollment successful");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        alert("enrollment failed");
      });
  };

  return (
    <Container>
      <Row>
        <Col>
          <Row>
            <Col>Course Code</Col>
            <Col>Description</Col>
          </Row>
          {courseData && courseData.length > 0 ? (
            courseData.map((c, i) => (
              <Row key={i}>
                <Col>{c.code || ""}</Col>
                <Col>{c.description || ""}</Col>
              </Row>
            ))
          ) : (
            <></>
          )}
        </Col>
        <Col>
          <Row>
            <Col>Capacity</Col>
            <Col>Enroll</Col>
          </Row>
          {capacityData && capacityData.length > 0 ? (
            capacityData.map((c, i) => {
              const enrolled =
                enrolledCourses &&
                enrolledCourses.findIndex((x) => x === c.uuid) !== -1;
              return (
                <Row key={i}>
                  <Col>
                    {c.current || "0"} / {c.value || ""}
                  </Col>
                  <Col>
                    <Button
                      disabled={enrolled || c.current >= c.value}
                      onClick={() => handelEnroll(c.uuid)}
                    >
                      {enrolled ? <>Enrolled</> : <>Enroll</>}
                    </Button>
                  </Col>
                </Row>
              );
            })
          ) : (
            <></>
          )}
        </Col>
      </Row>
      <Row>
        <Button onClick={() => router.push("/add_course")}>Add Course</Button>
      </Row>
    </Container>
  );
};

export default Home;
