//IT21013300
import React, { useEffect, useState } from "react";
import axios from "../axios";
import Loading from "./Loading";
import { Table,Button } from "react-bootstrap";
import Pagination from "./Pagination";

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
     if (users?.length == 0){
          return <h2 className="py-2 text-center">No users yet</h2>; //If no user
  }

  function UserSearch({ _id, name, email, bdate,address }) {
     return (
        <tr>
                            <td> {_id}</td>
                            <td>{name}</td>
                            <td>{email}</td>
                            <td>{bdate}</td>
                            <td>{address}</td>
                        </tr>
    );
 }

//Search for email+id+name+address+birthdate
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
                    <Pagination data={usersSearch} RenderComponent={UserSearch} pageLimit={1} dataLimit={5} tablePagination={true} />
                     </tbody>
                     <br></br>
                     <div className="col">
              <Button href="/Customers">  See in Full page </Button>
            </div>
                     </Table>
                    
            </div>
           )}
                    
             </div>
    );
                    
    
 }

 export default ClientsAdminPage;
