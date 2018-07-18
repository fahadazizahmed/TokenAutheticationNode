var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const{ObjectID} = require('mongodb')
const {SHA256}   = require('crypto-js');
const jwt = require('jsonwebtoken');
var authorization = require('../MiddleWare/auth')
const _ = require('lodash');

var usertable = require('../DatabaseModel/dbSchema');
var id = '5b4c12a1fcce7f22e0adf57b'

// Save Data is databbadse

router.post('/save',function(req,res,next){
  //var body = req.body;
  //var user = new usertable({email:req.body.email,password : req.body.password});

  var user = new usertable(req.body);
//var obj =   { name: req.body.name, rank: req.body.rank, availibility: req.body.availibility }
  //user.create(obj).then (function(user)//then function nly fire when   usermodel.create(req.body) action is completed
  usertable.create(user).then (function()//then function nly fire when   usermodel.create(req.body) action is completed

{
return user.generateAuthToken();

}).then(function(token){
  res.header('x-auth',token).send(user)
  //res.send(user)

}).catch(next)

});
router.get('/users/me', authorization ,function(req,res,next){
  res.send(req.user);



});
router.post('/users/login',function(req,res,next)
{
  var body  = _.pick(req.body, ['email','password']);
  usertable.findByCredential(body.email,body.password).then(function(user){
    return user.generateAuthToken().then(function(token){
      res.header('x-auth',token).send(user)
    });


}).catch(function(e){
  res.status(400).send();
});
});


router.delete('/users/me/token',authorization, function(req,res,next)
{

  req.user.removeToken(req.token).then(function(){
    res.status(200).send();
  }).then (function(){
    res.status(400).send();

  });


});



















router.delete('/delete/:id',function(req,res,next){
  console.log(req.body);
  var id  = req.params.id;
  user.findByIdAndRemove({_id:id}).then (function(user)
{
res.send(user);

}).catch(next);

});
/////////Delete End///////




router.put('/update/:id',function(req,res,next){//http://localhost:5600/api/update/5afac0faee2e27540c4b3934
 /*lock.findByIdAndUpdate({_id:req.params.id},req.body).then(function(lock){
    res.send(lock);// this will send us the previous data in response although in table it has been updated so we need to get the latets we need a little bit change

 }).catch(next);*/
 user.findByIdAndUpdate({_id:req.params.id},req.body).then(function(){
   user.findOne({_id:req.params.id}).then(function(user){
       res.send(user);

   });

 }).catch(next);
});


//            End Update                 //

// Find All Element in database

router.get('/allUser',function(req,res,next){
  if(!ObjectID.isValid(id)){
    console.log("id not valid")
  }

  user.find((err, user) => {
      // Note that this error doesn't mean nothing was found,
      // it means the database had an error while searching, hence the 500 status
      if (err) return res.status(500).send(err)
      // send the list of all people
      return res.status(200).send(user);
  }).catch(next);
});
// End of Find All Element/

// Find Specifi Element //

router.get('/FindSpecific',function(req,res,next){

  user.find({rank: 'captain'}, (err, user) =>{
    if (err) return res.status(500).send(err)

    // send the list of all people in database with name of "John James" and age of 36
    // Very possible this will be an array with just one Person object in it.
    return res.status(200).send(user);
});
});









































module.exports = router;
