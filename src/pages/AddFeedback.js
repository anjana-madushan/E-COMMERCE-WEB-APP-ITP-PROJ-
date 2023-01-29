import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import '../CSS/Post feedback.css';
//IT21013300

  //labelStyles function
  const labelStyles = { mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" };
  //Add feedback function
  const AddFeedback = () => {
    const User = useSelector((state) => state.user);
    //Use of styles from mui system
    //Use of navigate from react router dom
      useEffect(() => {
          console.log("userid", User._id);
       });
    const navigate = useNavigate();
    //implementing use state
    const [inputs, setInputs] = useState({
      title: "",
      description: "",
      imageURL: "",
      });

    //Handle change function
    const handleChange = (e) => {
      setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    };

    //send request function
    const sendRequest = async () => {
        console.log("User", User._id);
      const res = await axios.post("http://localhost:4000/feedbacks/addfeedback", {
        title: inputs.title,
        description: inputs.description,
        image: inputs.imageURL,
        user: User._id,
         }).catch((err) => console.log(err));
      const data = await res.data;
        return data;
    };

    //handle submit function
    const handleSubmit = (e) => {
      e.preventDefault();

      sendRequest()
        .then((data) => console.log("d", data))
        .then(() => navigate("/feedbacks"));
    };  
    
    //Form for feedback submisssion
    return (
      <div className="feedback">
        <form onSubmit={handleSubmit}>
          <Box
            border={3}
            borderColor="linear-gradient(90deg, rgba(255,252,13,1) 60%, rgba(110,224,200,1) 100%, rgba(169,175,14,1) 100%)"
            borderRadius={10}
            boxShadow="10px 10px 20px #ccc"
            padding={3}
            margin={"auto"}
            marginTop={3}
            display="flex"
            flexDirection={"column"}
            width={"80%"}
          >
          <Typography
            fontWeight={"bold"}
            padding={3}
            color="black"
            variant="h2"
            textAlign={"center"}
          >
            Post Your Feedback
          </Typography>
          <InputLabel sx={labelStyles}>Title</InputLabel>
          <TextField
            name="title"
            onChange={handleChange}
            value={inputs.title}
            margin="auto"
            variant="outlined"
          />
          <InputLabel sx={labelStyles}>Description </InputLabel>
          <TextField
            name="description"
            onChange={handleChange}
            value={inputs.description}
            margin="auto"
            variant="outlined"
          />
          <InputLabel sx={labelStyles}> ProductImageURL </InputLabel>
          <TextField
            name="imageURL"
            onChange={handleChange}
            value={inputs.imageURL}
            margin="auto"
            variant="outlined"
          />

          <Button
            sx={{ mt: 2, borderRadius: 4 }}
            variant="contained"
            color="warning"
            type="submit" 
          >
            {" "}
            Submit
          </Button>
         </Box>
        </form>
      </div>
    );
  };
  //AddFeedback
  export default AddFeedback;
