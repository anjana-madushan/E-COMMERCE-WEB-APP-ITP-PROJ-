import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, Modal, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import Feedback from "./Feedback";
import moment from "moment";
import { useNavigate } from "react-router-dom";

   const Feedbacks = () => {
   //Use of react hooks
   const [feedbacks, setFeedbacks] = useState([]);
   const [Date, setDate] = useState("");
   const [show, setShow] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [fullscreen, setFullscreen] = useState(true);
   const [Response, setResponse] = useState("");
   const handleClose = () => setShow(false);
   const loadTable = () => {};
   const navigate = useNavigate();
   const handleShow = () => {
    axios
      .get(`http://localhost:4000/feedbacks//report/${Date}`)
      .then((response) => {
        setResponse(response.data.feedbacks);
        console.log("Res", response);
      });

    setShow(true);
   };


   const user = useSelector((state) => state?.user?.user);
   const sendRequest = async () => {
    const res = await axios
      .get("http://localhost:4000/feedbacks/getallfeedbacks")
      .catch((err) => console.log(err));
    const data = await res.data;
    return data;
   };

 
   //React hooks and send request function to set feedbacks
   useEffect(() => {
    sendRequest().then((data) => setFeedbacks(data.feedbacks));
   }, []);
   console.log(feedbacks);

   const feedbacksearch = feedbacks.filter((feedbacks) => feedbacks.title.toLowerCase().includes(searchTerm.toLowerCase())||feedbacks.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
   console.log(feedbacksearch)

   return (
    <div>
     <div className="filters-container d-flex justify-content-center pt-4 pb-4">
        <input type="search" placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      {feedbacksearch.length===0 ? (
          <h1>No feedbacks yet</h1>
       ):(
  
       <div>
        {user.isAdmin && (
         <div className="row">
         <div className="col-md-8"></div>
        
         <div className="col-md-2">
          <input
            type="date"
            onChange={(e) => {
              setDate(e.target.value);
            }}
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <Button onClick={handleShow}>Report</Button>
        </div>
      </div>
       )}
       {feedbacksearch.map((feedback, index) => (
          <Feedback
            id={feedback._id}
            isUser={localStorage.getItem("userId") === feedback.user._id}
            title={feedback.title}
            description={feedback.description}
            imageURL={feedback.image}
            userName={feedback.user.name}
            userid={feedback.user._id}
            user={feedback.user}
          />
         ))}
         </div>
       )}
          {/* Modal to show the report and window.print to print report */}
       <Modal show={show} fullscreen={true} onHide={handleClose} size="xl">.
        <Modal.Header closeButton>
          <Modal.Title>Feedback Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col">
              <Button
                variant="primary"
                onClick={() => {
                  window.print();
                }}
              >
                Print Report
              </Button>
            </div>
          </div>
          <br></br>
          <Container>
            <Table>
              <tr>
                <th style={{ textAlign: "center" }}>Record Id</th>
                <th style={{ textAlign: "center" }}>Title</th>
                <th style={{ textAlign: "center" }}>Description</th>
                <th style={{ textAlign: "center" }}>Image Url</th>
                <th style={{ textAlign: "center" }}>Created Date</th>
              </tr>
              {Response &&
                Response.map((item, index) => {
                  return (
                    <tr>
                      <td style={{ textAlign: "center" }} key={index}>
                        {Number(index) + 1}{" "}
                      </td>
                      {/* <td style={{ textAlign: "center" }}>{item.user}</td> */}
                      <td style={{ textAlign: "center" }}>{item.title}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.description}
                      </td>
                      <td style={{ textAlign: "center" }}>{item.image}</td>
                      <td style={{ textAlign: "center" }}>
                        {moment(item.date).format("yyyy-DD-MM")}
                      </td>
                    </tr>
                  );
                })}
             </Table>
           </Container>
         </Modal.Body>

         <Modal.Footer></Modal.Footer>
       </Modal>
    </div>
  );
};
  //Export Feedbacks functions
export default Feedbacks;
