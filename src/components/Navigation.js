import React, { useRef, useState } from "react";
import axios from "../axios";
import { Navbar, Button, Nav, NavDropdown, Container } from "react-bootstrap";
import "../CSS/Navigation.css";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetNotifications } from "../features/userSlice";
import logo from "./LOGO.jpg";
import { useNavigate } from "react-router-dom";

function Navigation() {
  const history = useNavigate();
  const user = useSelector((state) => state.user);
  const bellRef = useRef(null)
  const notificationRef = useRef(null);
  const [bellPos, setBellPos] = useState({});

  const dispatch = useDispatch();

  function handleLogout() {
    history("/login");
    dispatch(logout());
  }
  const unreadNotifications = user?.notifications?.reduce((acc, current) => {
    if (current.status === "unread") return acc + 1;
    return acc;
  }, 0);

  function handleToggleNotifications() {
    const position = bellRef.current.getBoundingClientRect();
    setBellPos(position);
    notificationRef.current.style.display = notificationRef.current.style.display === "block" ? "none" : "block";
    dispatch(resetNotifications());
    if (unreadNotifications > 0) axios.post(`/users/${user._id}/updateNotifications`);
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <LinkContainer to="/">
          <img src={logo} alt="Logo" width={110} height={110} />
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* if no user*/}

            {!user && (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}

            {user && !user.isAdmin && (
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i>
                  {user?.cart?.count > 0 && (
                    <span className="badge badge-warning" id="cartcount">
                      {user.cart.count}
                    </span>
                  )}
                </Nav.Link>
              </LinkContainer>
            )}

            {/* if user*/}
            {user && (
              <>
                <Nav.Link style={{ position: "relative" }} onClick={handleToggleNotifications}>
                  <i className="fas fa-bell" ref={bellRef} data-count={unreadNotifications || null}></i>
                </Nav.Link>
                <NavDropdown title={`${user.email}`} id="basic-nav-dropdown">
                  {user.isAdmin ? (
                    <>
                      <LinkContainer to="/admin">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/feedbacks">
                        <NavDropdown.Item>Feedbacks</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/new-product">
                        <NavDropdown.Item>Create Product</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  ) : (
                    <>
                      <LinkContainer to="/user">
                        <NavDropdown.Item>Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orders">
                        <NavDropdown.Item>My orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/feedbacks">
                        <NavDropdown.Item>Feedbacks</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to={`/contactus`}>
                        <NavDropdown.Item>ContactUs</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/feedbacks/add">
                        <NavDropdown.Item>PostFeedback</NavDropdown.Item>
                      </LinkContainer>



                    </>
                  )}

                  {/* {!user.isAdmin && (
                 
                )} */}

                  <NavDropdown.Divider />
                  <Button
                    variant="danger"
                    onClick={handleLogout}
                    className="logout-btn"
                  >
                    Logout
                  </Button>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      {/* Notification */}
      <div className="notifications-container" ref={notificationRef} style={{ position: "absolute", top: bellPos.top + 30, left: bellPos.left, display: "none" }}>
        {user?.notifications?.length > 0 ? (
          user?.notifications.map((notification) => (
            <p className={`notification-${notification.status}`}>
              {notification.message}
              <br />
              <span>{notification.time.split("T")[0] + " " + notification.time.split("T")[1]}</span>
            </p>
          ))
        ) : (
          <p>No notifcations yet</p>
        )}
      </div>
    </Navbar>
  );
}

export default Navigation;
