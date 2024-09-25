import { Avatar, Box, Card, CardContent, CardHeader, CardMedia, Grid, IconButton, Typography} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import Pagination from "../components/Pagination";
import"../CSS/Feedback.css"
  //Feecback function
    const Feedback = ({
      title,
      description,
      imageURL,
      userName,
      id,
      userid,
      User,
    }) => {
  
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [Title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Image, setImage] = useState("");
    const user_id = useSelector((state) => state.user.user._id);

  //Handle Edit function
    const handleEdit = () => {
      axios.put(`http://localhost:4000/feedbacks/updateFeedback/${id}`, {
        title: Title,
        description: Description,
        image: Image,
        user: User,
      })
        .then((response) => {
          if (response) {
          window.location.reload(false);
        }
      });
    };
    const isAdmin = useSelector((state) => state.user.user.isAdmin);
    const thisuser = useSelector((state) => state.user.user._id);
  //Sending the delete request to the backend
    const deleteRequest = async () => {
    const res = await axios
      .delete(`http://localhost:4000/feedbacks/deletefeedback/${id}`)
      .catch((err) => console.log(err));
    const data = await res.data;
      return data;
    };

  //After deleting navigate back to All feedbacks page
    const handleDelete = () => {
    deleteRequest()
      .then(() => navigate("/"))
      .then(() => navigate("/feedbacks"));
      window.location.reload(false);
    };


    return (
    //UI to display feedback
      <div className="feedback">
        <Card
         sx={{
          width: "40%",
          margin: "auto",
          mt: 2,
          padding: 2,
          boxShadow: "5px 5px 10px #ccc",
          ":hover": {
            boxShadow: "10px 10px 20px #ccc",
          },
         }}
        >

        <CardHeader
          avatar={
            <Avatar
              /*className={classes.font}*/ sx={{ bgcolor: "red" }}
              aria-label="recipe"
            >
              {userName}
            </Avatar>
          }
      
          title={title}
    
        />
        <CardMedia
          component="img"
          height="350"
          image={imageURL}
          alt=""
        />

        <CardContent>
          <hr />
          <br />
          <Typography
            /*className={classes.font}*/ variant="body2"
            color="text.secondary"
          >
            <b>{userName}</b> {": "} {description}
          </Typography>
        </CardContent>
        {isAdmin ? ( /*If Admin*/
          <div>
            <button className="btn btn-danger" onClick={() => handleDelete()}>
              Delete
            </button>
          </div>
        ) : (
          thisuser == userid && (
            <button className="btn btn-primary" onClick={handleShow}>
              Edit
            </button>
          )
        )}
      </Card>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
          /*Modal for update feedback*/
            placeholder="Title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="form-control"
          />
          <br></br>
          <input
            placeholder="Description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className="form-control"
          />
          <br></br>
          <input
            placeholder="Image Url"
            onChange={(e) => {
              setImage(e.target.value);
            }}
            className="form-control"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Feedback;
