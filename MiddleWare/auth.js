var usertable = require('../DatabaseModel/dbSchema')

var authorization = function(req,res,next){
  var token = req.header('x-auth');
    console.log(token);

  usertable.findByToken(token).then(function(user){
    if(!user){
      return Promise.reject();

    }
    req.user = user;
    req.token = token;
    next();
  }).catch(function(e){
    res.status(401).send()
  });
}

module.exports = authorization;
