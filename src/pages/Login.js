import React, { useState } from 'react'
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import "../CSS/Signup.css";
import {useLoginMutation} from "../services/appApi";


function Login() {


    function changebackground(){
        document.body.style.backgroundColor = 'green';
      } 
    const[email,setEmail] =useState('');
    const[password,setPassword] =useState('');
    const [login, { isError, isLoading, error }] = useLoginMutation();

    function handleLogin(e) {
        e.preventDefault();
        login({ email, password });
    }
  return (
    <Container>
    <Row>
        <Col md={6} className="login_from--container">
            <Form style={{width:"100%"}} onSubmit={handleLogin}>
                <h1>Loging to your accoutnt</h1>
                {isError && <Alert variant="danger">{error.data}</Alert>}     

                       <Form.Group>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} required onChange={(e) => setEmail(e.target.value)}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" value={password} required onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>

                        <Form.Group>
                            <Button type ="submit" disabled={isLoading} >Login</Button>
                        </Form.Group>
                        <p> Dont have an account <Link to ="/signup">Create account</Link>?</p>
            </Form>
        </Col>
        <Col md={6} className="login_image--container"></Col>
    </Row>
 </Container>
  )
}

export default Login


