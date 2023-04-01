const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const User = db.user;
const Role = db.role;
const Resetpassword = db.resetpassword;
const RefreshToken = db.refreshToken;
const Op = db.Sequelize.Op;
const SendResetPasswordMail = nodemailer.main;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    email_marketing: req.body.email_marketing,
    terms_condition: req.body.terms_condition
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Email Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken,
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.resetpassword = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then((user) => {
    if (!user) {
      return res.status(404).send({ message: "User Email Not found." });
    }
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 10; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    Resetpassword.upsert({
      token:randomString,
      userid: user.id,
      email:req.body.email
    },{
      where: {
        userid: user.id
      }
    }).then((created) => {
        SendResetPasswordMail({"email":req.body.email,"token":randomString}).then(data=>{
          res.status(200).send(data);
        });
      }).catch(error => {
        console.error(error);
      });
    }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};

exports.verify_rp_token = (req, res) => {
  Resetpassword.findOne({
    where: {
      email: req.body.email,
      token: req.body.token,
      updated_at:{
        [Op.gt]: new Date(new Date() - 900000)
      }
    }
  }).then((user) => {
    if(user!==null && user!==undefined){
      res.status(200).send({ status: true });
    }else{
      res.status(200).send({ status: false });
    }
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};

exports.newpassword = (req, res) => {
  User.update({
    password: bcrypt.hashSync(req.body.password, 8),
    },{
    where: {
      email: req.body.email,
    }
  }).then((user) => {
    if(user!==null && user!==undefined){
      res.status(200).send({ status: true, message:"Password Succesfully Updated" });
    }else{
      res.status(200).send({ status: false, message:"Something Went To Wrong" });
    }
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    // console.log(refreshToken)

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
