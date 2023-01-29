import React, { Component } from 'react';
import axios from 'axios';


export default class StockTableRow extends Component {

    constructor(props) {
        super(props);
        this.deleteStock = this.deleteStock.bind(this);
    }

    deleteStock() {
        axios.delete('http://localhost:4000/stocks/delete-stock/' + this.props.obj._id)
            .then((res) => {
                alert('Stock successfully deleted!')
            }).catch((error) => {
                console.log(error)
            })
    }

    render() {


        return (

            <tr>
                
                <td>{this.props.obj.Stock_Num}</td>
                <td>{this.props.obj.Product_Name}</td>
                <td>{this.props.obj.Total_arrivels}</td>
                <td>{this.props.obj.brand}</td>
                <td>{this.props.obj.sales}</td>
                <td>{this.props.obj.avalible}</td>
                <td>{this.props.obj.status}</td>
                
               
            </tr>

        );
    }
}