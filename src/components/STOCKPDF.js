import React, { Component } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import StockTableRow2 from './StockTableRow2';//need to change


export default class STOCKPDF extends Component {

  constructor(props) {
    super(props)
    this.state = {
      returns: []
    };
  }
  

  componentDidMount() {
    axios.get('http://localhost:4000/stocks/')
      .then(res => {
        this.setState({
          returns: res.data
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  DataTable() {
    return this.state.returns.map((res, i) => {
      return <StockTableRow2 obj={res} key={i} />;
    });
  }

  render() {

    function printPage() {
        window.print();
    }
    return (<div className="table-wrapper" style={{color:"#000000"}}>

      <br>
      </br>
      <br>
      </br>
      <br>
      </br>
      <br>
      </br>
      <h2><i class="far fa-comment-alt"></i>&nbsp;Grading Details</h2><br/>
    


        <Table responsive="sm">
       
        <thead>
          <tr>
          
            <th>Stock Number</th>
            <th>Product Name</th>
            <th>Total Arrivels</th>
            <th>brand</th>
            <th>sales</th>
            <th>avalible</th>
            <th>Status</th>
           
            
          </tr>
        </thead>
        <tbody>
          {this.DataTable()}
        </tbody>
      </Table>
      <button onClick= {printPage}>Print</button>
    </div>);

  }
}

