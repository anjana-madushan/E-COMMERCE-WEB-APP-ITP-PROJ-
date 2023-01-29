import React from 'react'
import { Container, Nav, Tab, Col, Row } from "react-bootstrap";
import OrdersPage from './OrdersPage';
import Profile from './Profile';
import FeedbackDetail from './FeedbackDetail';
import "../CSS/UserDashboard.css";

//IT21013300
//User dashboard function
//This displays all three pages Profile, Contact Us and Orders Page
function UserDashboard() {
    return (
        <Container className="UserDashboard">
            <Tab.Container defaultActiveKey="profile" >
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="profile">My Details</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="orders">Orders</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="feedbacks">My Feedbacks</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="profile">
                             <Profile/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="orders">
                                <OrdersPage/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="feedbacks">
                            <FeedbackDetail/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
}

export default UserDashboard;