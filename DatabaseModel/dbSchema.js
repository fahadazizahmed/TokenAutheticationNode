var mongoose = require('mongoose');
const validator = require ('validator')
const {SHA256}   = require('crypto-js');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var usertable = new mongoose.Schema({

  email :{
    type:String,
    trim : true,
    minlength : 3,
    unique : true,
    required:true,

   validate:{
     validator : validator.isEmail,
     message : '{VALUE} is not valid email'
   }
 },
 password : {
   type: String,
   required : true,
   minlength : 6

 },
 tokens : [{
   access:{
     type:String,
     required:true
   },
   token:{
     type:String,
     required: true
   }

 }]












});
// istance method usertable is instance it is the structure of one user
// it return only email and id in response not full object if not use return full object
usertable.methods.toJSON = function(){

  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject ,['_id','email']);
};


usertable.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id:user._id.toHexString(), access}, 'secretss').toString();
  user.tokens.push({access,token});
  return user.save().then(() =>{
    return token;
  });
};


usertable.methods.removeToken = function(token){
  var user = this;
  return user.update({
    $pull : {
      tokens : {
        token : token
      }
    }

  });

};


usertable.statics.findByToken = function (token){
  var  user = this;
  var decoded;
  try {
  decoded = jwt.verify(token,'secretss');

  }
  catch(e){
return Promise.reject()
  }

return user.findOne({
   '_id': decoded._id,
   'tokens.token' : token,
  'tokens.access' : 'auth'
});

};

usertable.pre('save', function(next){
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10,function(err,salt){
      bcrypt.hash(user.password,salt,function(err,hash){
        user.password = hash;
        next();
      });

    });
  }
  else {
    next();
  }
});


usertable.statics.findByCredential = function (email, password){
  var  user = this;


return user.findOne({email}).then(function(user){
  if(!user){
    return Promise.reject();
  }
  return new Promise(function(resolve,reject){
    bcrypt.compare(password,user.password,function(err,res){
      if(res){
        resolve (user)
      }
      else {
        reject();
      }

    });
  });

});

};






var usertable = mongoose.model('UserTable',usertable)//UserTable' is the name of table or collection
module.exports = usertable
