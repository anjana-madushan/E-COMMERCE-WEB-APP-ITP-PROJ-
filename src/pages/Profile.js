import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "../axios";
import Loading from "../components/Loading";
import "../CSS/Profile.css";
import CakeIcon from '@mui/icons-material/Cake';
import PermIdentitySharpIcon from '@mui/icons-material/PermIdentitySharp';
import EmailIcon from '@mui/icons-material/Email';
import LocationCityIcon from '@mui/icons-material/LocationCity';

//Customer profile function
function Profile () {
   const userd = useSelector((state) => state?.user?.user);
   const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setLoading(true);
        axios
            .get(`/users/${userd._id}`)
            .then(({ data }) => {
                setLoading(false);
                setUsers(data);
            })
            .catch((e) => {
                setLoading(false);
                console.log(e);
            });
    }, []);

    if (loading) {
        return <Loading />;
    }
     
    return (
        <Container className="Profile">
               <hr></hr>
                  <PermIdentitySharpIcon fontSize="large"/> <h2> Welcome {users.name} !!!! </h2>
               <hr></hr>
               <br></br>
                 <Table  striped bordered >
               <tr>
                <td>
                 <h3><EmailIcon/> Email : </h3>
                </td>
                <td>{users.email}</td>
               </tr>
                 <br/>
                 <br/>
               <tr>
                <td>
                 <h3><CakeIcon/> BirthDate : </h3>
                </td>
                <td>{users.bdate}</td>
               </tr>
               <br/>
               <br/>
               <tr>
                <td>
                 <h3><LocationCityIcon/> City : </h3>
                </td>
                <td>{users.address}</td>
               </tr>
            </Table>
        </Container>
    );
}
export default Profile;