import { Container, Table } from "react-bootstrap";
import "../CSS/ContactUs.css";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import PhoneIcon from '@mui/icons-material/Phone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ContactUsimg from '../components/ContactUs.jpeg';
import LocationCityIcon from '@mui/icons-material/LocationCity';
//IT21013300
//Contact Us function
    function ContactUs () {
 
     return (
            <Container className='ContactUs'>
      
                 <Table striped bordered  >
                    <thead>
                   <tr>
                         <th>
                        <h40 className="h40"> For any inquires pls feel free to contact us  <SentimentSatisfiedAltIcon /></h40>

                         </th>
                         <th>
                         <h40 className="h40"> Opening Hours (MON-FRI) from 8am to 6pm  <AccessTimeIcon /></h40>
                         </th>
                     </tr>
                     <br/><br/>
                     <tr>
                         <td>
                             <h39 className="h39">
                                 <PhoneIcon />    Phone: - 
                             </h39>
                         </td>
                         <td>
                             <h39 className="h39">
                                 <a href="tel:0778546061" onclick="ga('send', 'event', { eventCategory: 'Contact', eventAction: 'Call', eventLabel: 'Mobile Button'});"><p class="call-button">077 854 6061</p></a>
                             </h39>
                         </td>
                         </tr>
                         <br/><br/>
                         <tr>
                         <td>
                             <h39 className="h39">
                                 <AlternateEmailIcon/> Email: - 
                             </h39>
                         </td>
                         <td>
                            <h39 className="h39"><a href = "mailto: mastertech @gmail.com">mastertech @gmail.com</a></h39>
                         </td>
                     </tr>
                     <br/><br/>
                     <tr>
                         <td>
                             <h39 className="h39">
                                 <LocationCityIcon /> Address: - 
                             </h39>
                         </td>
                         <td>
                            <h39 className="h39"> 516 Badulla Road, Bandarawela 90100</h39>
                         </td>
                     </tr>
                     </thead>
                     <tr>
                      
                        <td>
                      <center>
                        <img src={ContactUsimg}   alt="Contactimg" className="Contactimg" width={200} height={200}/>
                   </center>
                        </td>
                     </tr>
               
                 </Table>
             </Container>
    
     );
 }
 export default ContactUs;
