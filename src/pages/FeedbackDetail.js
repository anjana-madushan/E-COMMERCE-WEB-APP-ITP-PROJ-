import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Feedback from "./Feedback";
//FeedbackDetails function
const FeedbackDetail = () => {
  const userid = useSelector((state) => state?.user?.user?._id);
  //Use of use state react hooks
  const [feedback, setFeedback] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const id = useParams().id;
  console.log(id);


  //Fetch details function to fetch details from the backend
  const fetchDetails = async () => {
    const res = await axios
      .get(`http://localhost:4000/feedbacks/fuser/` + userid)
      .catch((err) => console.log(err));
    const data = await res.data;
    return data;
  };

  //Reacthooks (Use Effect to update the data)
  useEffect(() => {
    fetchDetails().then((data) => {
      setFeedback(data.user);
      console.log(data.user);
    });
  },);
  //Feeback Search
  const feedbacksearch = feedback.filter((user) => user.title.toLowerCase().includes(searchTerm.toLowerCase()));
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
        {feedbacksearch.map((feedback, index) => (
            <Feedback //Get user feedbacks from feedbacksearch and display it through feedback
              id={feedback._id}
              isUser={localStorage.getItem("userId") === feedback.user._id}
              title={feedback.title}
              description={feedback.description}
              imageURL={feedback.image}
              userName={feedback.user.name}
              userid={feedback.user}
             
            />
          ))}
      </div> 
            )}
    </div>
                    
  );
};

export default FeedbackDetail;
