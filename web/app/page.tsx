import { redirect } from "next/navigation";
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

// export const fetchData = async (): Promise<{
//   courseData: CourseData[];
//   capacityData: CapacityData[];
// }> => {
//   // const res_courses = await fetch(`${process.env.COURSE_URL}/all`, {
//   //   method: "get",
//   // });
//   // if (res_courses.status == 401) {
//   //   redirect("/login");
//   // }
//   // const courseData: CourseData[] = await res_courses.json();
//   // const res_capacity = await fetch(
//   //   `${process.env.ENROLLMENT_URL}/capacity/all`,
//   //   {
//   //     method: "get",
//   //   }
//   // );
//   // const capacityData: CapacityData[] = await res_capacity.json();
//   // return { courseData, capacityData };
// };

const Home = async () => {
  // const { courseData, capacityData } = await fetchData();

  return (
    <Container>
      <Col>
        <Row>
          <Col>Course Code</Col>
          <Col>Description</Col>
        </Row>
        {/* {courseData.map((c) => (
            <Row>
              <Col>{c.code || ""}</Col>
              <Col>{c.description || ""}</Col>
            </Row>
          ))} */}
      </Col>
      <Col>
        <Row>
          <Col>Capacity</Col>
          <Col>Enroll</Col>
        </Row>
        {/* {capacityData.map((c) => (
            <Row>
              <Col>
                {c.current || ""}/{c.value || ""}
              </Col>
              <Col>
                <Button>Enroll</Button>
              </Col>
            </Row>
          ))} */}
      </Col>
    </Container>
  );
};

export default Home;
