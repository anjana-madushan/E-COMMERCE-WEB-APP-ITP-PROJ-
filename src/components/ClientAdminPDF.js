//IT21013300
import React, { useEffect, useState } from "react";
import axios from "../axios";
import Loading from "./Loading";
import { Table,Button} from "react-bootstrap";
//This function created to search  a particular field in report and get it printed or save as a pdf on a full pag scale
function ClientsAdminPage() {
    //Use state for users
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); 


   
  useEffect(() => {
        setLoading(true);
        axios
            .get("/users") //get all users thru axios
            .then(({ data }) => {
                setLoading(false);
                setUsers(data);
            })
            .catch((e) => {
                setLoading(false);
                console.log(e);
            });
    }, []);

    
      if (loading) return <Loading />;

      const usersSearch = users.filter((users) => users.email.includes(searchTerm)||users._id.includes(searchTerm)||users.address.includes(searchTerm)||users.bdate.includes(searchTerm));
      console.log(usersSearch)

      return (
         <div className="client-page-container">
     
       <div className="filters-container d-flex justify-content-center pt-4 pb-4">
                 <input type="search" placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)} />
             </div>
             {usersSearch.length===0 ? (
                 <h1>No users yet</h1>
             ):(
          
                  <div>
                      <Table responsive striped bordered hover>
                     <thead>
                      <tr>
                        <th>Customers Id</th>
                        <th>Customers Name</th>
                        <th>Email</th>
                        <th>Birthdate</th>
                        <th>Address</th>
                      </tr>
                    </thead>
                   <tbody>
                    {usersSearch.map((user) => (
                        <tr>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.bdate}</td>
                            <td>{user.address}</td>
                        </tr>
                    ))}
                     </tbody>
                     <br></br>
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
                     </Table>
                    
            </div>
            )}
             </div>
    );
                    
    
}

export default ClientsAdminPage;
