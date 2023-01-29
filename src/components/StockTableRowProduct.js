import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

export default class StockTableRowProduct extends Component {

   

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
               
                <td>
                    
                </td>
            </tr>

        );
    }
}