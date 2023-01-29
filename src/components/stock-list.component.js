import React, { Component } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import StockTableRow from './StockTableRow';// need to change 


export default class StockList extends Component {

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
      return <StockTableRow obj={res} key={i} />;
    });
  }

  filterContent(returns, searchTerm){
    const result= returns.filter((list)=> list.Stock_Num.includes(searchTerm));
    this.setState({ returns: result });
  }

  handleTextSearch=(e)=>{

    console.log(e.currentTarget.value);
    const searchTerm = e.currentTarget.value;
    axios.get('http://localhost:4000/stocks/')
    .then(res =>{
      const returns = res.data;
      this.setState({ returns });
      this.filterContent(returns, searchTerm)
      
    })
  }




  render() {
    return (<div className="table-wrapper">
       <br></br>
      <br></br>
      <br></br>
      <h2><i class="ffa-duotone fa-file-chart-column"></i>&nbsp;Stock Details List</h2><br/>

      <form className="md-3">
          <input className="form-control mt-1" type="search" placeholder="Search" aria-label="Search"   onChange={this.handleTextSearch}></input>
          
        </form>
        &nbsp;&nbsp;

        <Table striped bordered hover responsive>
      
        <thead>
          <tr>
            <th>Stock Number</th>
            <th>Product Name</th>
            <th>Total Arrivels</th>
            <th>brand</th>
            <th>sales</th>
            <th>avalible</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {this.DataTable()}
        </tbody>
      </Table>
      <button className="btn btn-success"><a href="/create-stock" style={{textDecoration:'none',color:'white'}}><i class="fas fa-graduation-cap"></i>&nbsp;Add stock Details</a></button>
      &nbsp;&nbsp;
<button className="btn btn-success"><a href="/stockPDF" style={{textDecoration:'none',color:'white'}}> <i class="fas fa-book"></i>&nbsp;Genarate Report</a></button>
    </div>);
  }
}