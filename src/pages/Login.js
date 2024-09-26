import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../CSS/Signup.css";
import { useLoginMutation } from "../services/appApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

function Login() {
  function changebackground() {
    document.body.style.backgroundColor = "green";
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oAuth, setOauth] = useState(false);
  const [login, { isError, isLoading, error }] = useLoginMutation();

  function handleLogin(e) {
    e.preventDefault();
    if (!oAuth){
    login({ email, password });
    } else {
      window.open(`${process.env.REACT_APP_API_URL}/users/google/`);
    }
  }
  return (
    <Container>
      <Row>
        <Col md={6} className="login_from--container">
          <Form style={{ width: "100%" }} onSubmit={handleLogin}>
            <h1>Loging to your accoutnt</h1>
            {isError && <Alert variant="danger">{error.data}</Alert>}

            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                required={!oAuth} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                required={!oAuth} 
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "row",
                margin: "10px 0",
              }}
            >
              <Form.Group style={{ margin: "0 10px" }}>
                <Button type="submit" disabled={isLoading} onClick={() => setOauth(false)}>
                  Login
                </Button>
              </Form.Group>
              <Form.Group style={{ margin: "0 10px" }}>
                <Button type="submit" disabled={isLoading} onClick={() => setOauth(true)}>
                  Login with <FontAwesomeIcon icon={faGoogle} />
                </Button>
              </Form.Group>
            </div>

            <p>
              {" "}
              Dont have an account <Link to="/signup">Create account</Link>?
            </p>
          </Form>
        </Col>
        <Col md={6} className="login_image--container"></Col>
      </Row>
    </Container>
  );
}

export default Login;
