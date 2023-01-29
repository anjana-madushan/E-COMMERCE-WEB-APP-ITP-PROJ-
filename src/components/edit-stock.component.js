import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';

export default class EditStock extends Component {

  constructor(props) {
    super(props)

    this.onChangeStockStock_Num = this.onChangeStockStock_Num.bind(this);
    this.onChangeStockProduct_Name = this.onChangeStockProduct_Name.bind(this);
    this.onChangeStockTotal_arrivels= this.onChangeStockTotal_arrivels.bind(this);
    this.onChangeStockbrand= this.onChangeStockbrand.bind(this);
     
    this.onChangeStocksales= this.onChangeStocksales.bind(this);
    this.onChangeStockavalible= this.onChangeStockavalible.bind(this);
    this.onChangeStockstatus= this.onChangeStockstatus.bind(this);
    
   
    this.onSubmit = this.onSubmit.bind(this);

    // State
    this.state = {
      Stock_Num: '',
      Product_Name:'',
      Total_arrivels: '',
      brand: '',
      sales: '',
      avalible: '',
      status: ''
      
    }
  }

  componentDidMount() {
    axios.get('http://localhost:4000/stocks/edit-stock/' + this.props.match.params.id)
      .then(res => {
        this.setState({
         Stock_Num: res.data.Stock_Num,
         Product_Name: res.data.Product_Name,
         Total_arrivels: res.data.Total_arrivels,
         brand: res.data.brand,
          
         sales: res.data.sales,
         avalible: res.data.avalible,
         status: res.data.status
         
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  onChangeStockStock_Num(e) {
    this.setState({ Stock_Num: e.target.value })
  }

  onChangeStockProduct_Name(e) {
    this.setState({ Product_Name: e.target.value })
  }

  onChangeStockTotal_arrivels(e) {
    this.setState({ Total_arrivels: e.target.value })
  }

  onChangeStockbrand(e) {
    this.setState({ brand: e.target.value })
  }

   
  onChangeStocksales(e) {
    this.setState({ sales: e.target.value })
  }

  onChangeStockavalible(e) {
    this.setState({ avalible: e.target.value })
  }

  onChangeStockstatus(e) {
    this.setState({ status: e.target.value })
  }


  

  onSubmit(e) {
    e.preventDefault()

    const stockObject = {
      Stock_Num: this.state.Stock_Num,
      Product_Name: this.state.Product_Name,
      Total_arrivels: this.state.Total_arrivels,
      brand: this.state.brand,
      sales: this.state.sales,
      avalible: this.state.avalible,
      status: this.state.status

      
    };

    axios.put('http://localhost:4000/stocks/update-stock/' + this.props.match.params.id, stockObject)
      .then((res) => {
        console.log(res.data)
        console.log('stock successfully updated')
      }).catch((error) => {
        console.log(error)
      })

    // Redirect to customer List 
    this.props.history.push('/stock-list')
  }


  render() {
    return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>
        <br></br>
        <br></br>
      &nbsp;&nbsp;<h2>Update Details</h2>
      <br></br>
      
      <Form.Group controlId="Stock_Num">
          <Form.Label>Stock Number</Form.Label>
          <Form.Control type="text" value={this.state.Stock_Num} onChange={this.onChangeStockStock_Num} />
        </Form.Group>

        <Form.Group controlId="Product_Name">
          <Form.Label>Product_Name</Form.Label>
          <Form.Control type="text" value={this.state.Product_Name} onChange={this.onChangeStockProduct_Name} />
        </Form.Group>

        <Form.Group controlId="Total_arrivels">
          <Form.Label>Total_arrivels</Form.Label>
          <Form.Control type="text" value={this.state.Total_arrivels} onChange={this.onChangeStockTotal_arrivels} />
        </Form.Group>

        <Form.Group controlId="brand">
          <Form.Label>brand</Form.Label>
          <Form.Control type="text" value={this.state.brand} onChange={this.onChangeStockbrand}  />
        </Form.Group>

        

        <Form.Group controlId="sales">
          <Form.Label>salese</Form.Label>
          <Form.Control type="text" value={this.state.sales} onChange={this.onChangeStocksales} />
        </Form.Group>

        <Form.Group controlId="avalible">
          <Form.Label>avalible</Form.Label>
          <Form.Control type="text" value={this.state.avalible} onChange={this.onChangeStockavalible} />
        </Form.Group>

        <Form.Group controlId="status">
          <Form.Label>status</Form.Label>
          <Form.Control type="text" value={this.state.status} onChange={this.onChangeStockstatus}/>
        </Form.Group>

      

        <br/>
        <Button variant="danger" size="lg" block="block" type="submit">
          Update Details
        </Button>
      </Form>
    </div>);
  }
}