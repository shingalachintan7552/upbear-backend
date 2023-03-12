isUserEmailOrPassword = (req, res, next) => {
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

isUserEmail = (req, res, next) => {
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
  next();
};


const verifySigIn = {
  isUserEmailOrPassword:isUserEmailOrPassword,
  isUserEmail:isUserEmail
};

module.exports = verifySigIn;
