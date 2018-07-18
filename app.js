var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyparser = require('body-parser')
mongoose.connect('mongodb://localhost/Model_Crud_udemy');
mongoose.Promise = global.Promise;
var controller = require('./Controller/router.js');



app.use(bodyparser.json());

app.use('/api',controller)

app.use(function(err,req,res,next){
  console.log(err.message)
  res.status(404).send({Error:err.message});
});
app.listen(4000);
console.log('we are listeneing you on port 4000')
