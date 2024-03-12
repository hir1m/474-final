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

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordR, setPasswordR] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      if (password !== passwordR) {
        alert("password mismatch");
        return;
      }

      const res = await axios.post(
        `/api/auth/create`,
        {
          email,
          name: username,
          password,
        },
        { withCredentials: true }
      );
      alert("success");
      router.push("/login");
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
          <FormLabel>Email</FormLabel>
          <FormControl
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <FormLabel>Retype Password</FormLabel>
          <FormControl
            type="password"
            value={passwordR}
            onChange={(e) => setPasswordR(e.target.value)}
            placeholder="Retype password"
          />
          <Button variant="primary" onClick={(_) => handleSubmit()}>
            Submit
          </Button>
          <Button variant="primary" onClick={() => router.push("/login")}>
            Login
          </Button>
        </Form>
      </Container>
    </main>
  );
};

export default RegisterPage;
