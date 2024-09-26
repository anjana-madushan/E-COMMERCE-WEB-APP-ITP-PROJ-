import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useSignupMutation } from "../services/appApi";
import "../CSS/Signup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bdate, setbdate] = useState("");
  const [address, setaddress] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [oAuth, setOauth] = useState(false);
  const [signup, { error, isLoading, isError }] = useSignupMutation();
  const recaptchaId = "recaptcha-container";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          if (!document.getElementById(recaptchaId).hasChildNodes()) {
            window.grecaptcha.render(recaptchaId, {
              sitekey: process.env.REACT_APP_CHALL_SITE_KEY,
              callback: (response) => {
                setCaptchaValue(response);
              },
            });
          }
        });
      }
    };
    return () => {
      document.body.removeChild(script);
    };
  }, [recaptchaId]);

  function handleSignup(e) {
    e.preventDefault();
    if (!oAuth && captchaValue) {
      signup({ name, bdate, address, email, password });
    } else if (!oAuth) {
      alert("Please complete the reCAPTCHA challenge.");
    } else {
      window.open(`${process.env.REACT_APP_API_URL}/auth/google/`);
    }
  }

  return (
    <Container>
      <Row>
        <Col md={6} className="signup_from--container">
          <Form style={{ width: "100%" }} onSubmit={handleSignup}>
            <h1>Create an account</h1>
            {isError && !oAuth && <Alert variant="danger">{error.data}</Alert>}
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Your Name"
                value={name}
                required={!oAuth}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>BirthDate</Form.Label>
              <Form.Control
                type="text"
                placeholder="02/11/2002"
                value={bdate}
                required={!oAuth}
                onChange={(e) => setbdate(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="City(Only)"
                value={address}
                required={!oAuth}
                onChange={(e) => setaddress(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Your Email"
                value={email}
                required={!oAuth}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                required={!oAuth}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            {/* This is where the reCAPTCHA widget will render */}
            <div
              id={recaptchaId}
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "10px 0",
              }}
            />

            <Form.Group>
              <p></p>
              <hr></hr>
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
                  <Button
                    type="submit"
                    disabled={isLoading}
                    onClick={() => setOauth(false)}
                  >
                    Signup
                  </Button>
                </Form.Group>
                <Form.Group style={{ margin: "0 10px" }}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    onClick={() => setOauth(true)}
                  >
                    Signup with <FontAwesomeIcon icon={faGoogle} />
                  </Button>
                </Form.Group>
              </div>
            </Form.Group>
            <hr></hr>
            <p>
              {" "}
              Dont have an account <Link to="/login">login</Link>?
            </p>
          </Form>
        </Col>
        <Col md={6} className="signup_image--container"></Col>
      </Row>
    </Container>
  );
}

export default Signup;
