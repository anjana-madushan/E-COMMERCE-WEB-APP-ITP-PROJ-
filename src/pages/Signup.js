import React, { useState } from 'react'
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom';

import {useSignupMutation}from "../services/appApi";
import "../CSS/Signup.css";



function Signup() {
    const[email,setEmail] =useState('');
    const[password,setPassword] =useState('');
    const[name,setName] =useState('');
    const[bdate,setbdate] =useState('');
    const[address,setaddress] =useState('');
    const[signup,{error,isLoading,isError}] = useSignupMutation();


function handleSignup(e) {
        e.preventDefault();
        signup({ name, bdate, address, email, password });
    }


  return (
    <Container>
    <Row>
        <Col md={6} className="signup_from--container">
            <Form style={{width:"100%"}} onSubmit={handleSignup}>
                <h1>Create an account</h1>
                {isError && <Alert variant="danger">{error.data}</Alert>}    
                         <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Your Name" value={name} required onChange={(e) => setName(e.target.value)}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>BirthDate</Form.Label>
                            <Form.Control type="text" placeholder="02/11/2002" value={bdate} required onChange={(e) => setbdate(e.target.value)}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="City(Only)" value={address} required onChange={(e) => setaddress(e.target.value)}/>
                        </Form.Group>

                       <Form.Group>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" placeholder="Enter Your Email" value={email} required onChange={(e) => setEmail(e.target.value)}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter Password" value={password} required onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>
                              
                        <Form.Group>
                            <p></p>
                            <Button type ="submit"disabled={isLoading}>
                                Create account
                            </Button>

                        </Form.Group>
                        <hr></hr>
                        <p> Dont have an account <Link to ="/login">login</Link>?</p>
            </Form>
        </Col>
        <Col md={6} className="signup_image--container"></Col>
    </Row>
 </Container>
  )
}

export default Signup
