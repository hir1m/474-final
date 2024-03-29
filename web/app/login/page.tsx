"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  FormLabel,
  FormControl,
} from "react-bootstrap";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    // silent auth

    axios
      .post("/api/auth/silent")
      .then((_) => router.push("/"))
      .catch((e) => console.log(e));
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `/api/auth/normal`,
        {
          name: username,
          password: password,
        },
        { withCredentials: true }
      );
      router.push("/");
    } catch (e: any) {
      console.log(e);
      alert(e.response?.data.message);
    }
  };

  return (
    <main>
      <Container>
        <Form>
          <FormLabel>Username</FormLabel>
          <FormControl
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <Button variant="primary" onClick={(_) => handleSubmit()}>
            Submit
          </Button>
          <Button variant="primary" onClick={() => router.push("/register")}>
            Register
          </Button>
        </Form>
      </Container>
    </main>
  );
};

export default LoginPage;
