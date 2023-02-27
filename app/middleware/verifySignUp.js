const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

isUsernameOrEmailOrPassword = (req, res, next) => {
  if(req.body.username==undefined || req.body.username==""){
    res.status(400).send({
      message: "Failed! Please enter username!"
    });
    return;
  }
  if(req.body.email==undefined || req.body.email==""){
    res.status(400).send({
      message: "Failed! Please enter email!"
    });
    return;
  }else if(!(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).test(req.body.email)){
    res.status(400).send({
      message: "Failed! Please enter valid email adderess!"
    });
    return;
  }
  if(req.body.password==undefined || req.body.password==""){
    res.status(400).send({
      message: "Failed! Please enter password!"
    });
    return;
  }
  next();
};

checkDuplicateUsernameOrEmail = (req, res, next) => {

  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }
  
  next();
};

const verifySignUp = {
  isUsernameOrEmailOrPassword:isUsernameOrEmailOrPassword,
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
