"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Container,
  Form,
  Button,
  FormLabel,
  FormControl,
} from "react-bootstrap";

const AddCoursePage = () => {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `/api/course/create`,
        {
          code,
          description,
        },
        { withCredentials: true }
      );

      const { uuid } = res.data;

      try {
        await axios.post(
          `/api/enrollment/capacity/create`,
          {
            uuid,
            capacity,
          },
          { withCredentials: true }
        );
        router.push("/");
      } catch (e: any) {
        await axios.post(
          `/api/course/delete`,
          {
            uuid,
          },
          { withCredentials: true }
        );
        alert("Course creation failed.");
      }
    } catch (e: any) {
      console.log(e);
      alert(e.response?.data.message);
    }
  };

  return (
    <main>
      <Container>
        <Form>
          <FormLabel>Course Code</FormLabel>
          <FormControl
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter course code"
          />
          <FormLabel>Course Description</FormLabel>
          <FormControl
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter course description"
          />
          <FormLabel>Course Capacity</FormLabel>
          <FormControl
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Enter course capacity"
          />
          <Button variant="primary" onClick={(_) => handleSubmit()}>
            Submit
          </Button>
        </Form>
      </Container>
    </main>
  );
};

export default AddCoursePage;
