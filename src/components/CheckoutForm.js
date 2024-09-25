import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {  useCreateOrderMutation } from "../services/appApi";

 //Function Check out form
 function CheckoutForm () {
     const stripe = useStripe();
     const elements = useElements();
     const user = useSelector((state) => state.user.user);
     const navigate = useNavigate();
     const [alertMessage, setAlertMessage] = useState("");
     const [createOrder, { isLoading, isError, isSuccess }] = useCreateOrderMutation();
     const [country, setCountry] = useState("");
     const [address, setAddress] = useState("");
     const [paying, setPaying] = useState(false);

     //Stripe payment handling function
     async function handlePay(e) {
         e.preventDefault();
         if (!stripe || !elements || user.cart.count <= 0) return;
         setPaying(true);
         const { client_secret } = await fetch("http://localhost:4000/create-payment", {
             method: "POST",
             headers: {
                 "Content-Type": "application/json",
                 "Authorization": "Bearer sk_test_51LhBwPD1ftP7zi2EFzCqknBRwERKsNxtKCEJGL7I6ng3mSy6nOAW8kSIz8ivpxVXBpGfcObm7cRCFzqh1rIHcDYR00VAPeCQ9k",
             },
             //Retreving the user cart total
             body: JSON.stringify({ amount: user.cart.total*100}),
         }).then((res) => res.json());
         const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {//Client secret to be confirmed by the authorization part
             payment_method: {
                 card: elements.getElement(CardElement),
             },
         });

         setPaying(false); //Once payment succeeded

         if (paymentIntent) {
             createOrder({ userId: user._id, cart: user.cart, address, country }).then((res) => {
                 if (!isLoading && !isError) {
                     setAlertMessage(`Payment ${paymentIntent.status}`);
                     <h1>success</h1>
                     setTimeout(() => {
                         alert("Payment is a success");
                      navigate("/orders");
                     }, 3000);
                }
             });
         }
     }

 return (
     //Handle payment form
     <Col className="cart-payment-container">
         <Form onSubmit={handlePay}>
              <Row>
                 {alertMessage && <Alert>{alertMessage}</Alert>}
                   <Col md={6}>
                     <Form.Group className="mb-3">
                         <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="First Name" value={user.name} disabled />
                      </Form.Group>
                   </Col>
                   <Col md={6}>
                     <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" placeholder="Email" value={user.email} disabled />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={7}>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </Form.Group>
                    </Col>
                    <Col md={5}>
                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                        </Form.Group>
                    </Col>
                </Row>
                <label htmlFor="card-element">Card</label>
                <CardElement id="card-element" />
                <Button className="mt-3" type="submit" disabled={user.cart.count <= 0 || paying || isSuccess}>
                    {paying ? "Processing..." : "Pay"}
                </Button>
            </Form>
        </Col>
    );
}

export default CheckoutForm;