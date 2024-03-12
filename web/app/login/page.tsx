import { redirect } from "next/navigation";
import {
  Container,
  Form,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
  FormText,
  FormCheck,
} from "react-bootstrap";

const LoginPage = async () => {
  return (
    <main>
      <Container>
        <Form>
          <FormGroup className="mb-3" controlId="formLogin">
            <FormLabel>Username</FormLabel>
            <FormControl type="username" placeholder="Enter username" />
            <FormText className="text-muted">
              We'll never share your username with anyone else.
            </FormText>
          </FormGroup>

          <FormGroup className="mb-3" controlId="formBasicPassword">
            <FormLabel>Password</FormLabel>
            <FormControl type="password" placeholder="Password" />
          </FormGroup>
          <FormGroup className="mb-3" controlId="formBasicCheckbox">
            <FormCheck type="checkbox" label="Check me out" />
          </FormGroup>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </main>
  );
};

export default LoginPage;
