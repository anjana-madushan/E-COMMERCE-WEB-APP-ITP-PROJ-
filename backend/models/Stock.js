const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let stockSchema = new Schema({
  Stock_Num: {
    type : String,
    required: true
 },
 Product_Name: {
    type : String,
    required: true
 },
 Total_arrivels: {
     type : String,
     required: true
  },
 brand: {
     type : String,
     required: true
  },
  
sales: {
  type : String,
  required: true
},
avalible: {
  type : String,
  required: true
},
status: {
  type : String,
  required: true
}

},

{
    collection: 'stocks'
  })

module.exports = mongoose.model('Stock', stockSchema)