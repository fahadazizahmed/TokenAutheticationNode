/*const {SHA256}   = require('crypto-js');
var message = 'this is 3';
console.log(message);
var hash = SHA256(message).toString()
console .log(hash);
var data =  {
  id: 4
}
var token = {
  data,
  hash : SHA256(JSON.stringify(data)+ 'somesecret').toString()
}
//token.data.id = 5;
//token.hash =  SHA256(JSON.stringify(data))

var resulthash =  SHA256(JSON.stringify(data)+ 'somesecret').toString();
if(resulthash === token.hash){
  console.log('data not changed')
}
else {
    console.log('data changed')
}
*/
const {SHA256}   = require('crypto-js');
const jwt = require('jsonwebtoken');
var data = {
  id : 4,
  name : 'fahad'
}
var token = jwt.sign(data , 'secretss');//it take your data and hash the data and take seccret and return you the tokens
// we send this token to user when user login or sign up and this value we store in token array we declare in model
console.log(token);
var decode = jwt.verify(token,'secretss');
console.log('decoded data',decode);
