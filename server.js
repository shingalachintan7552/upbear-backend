const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://127.0.0.1:5173"
};

// app.use(cors());
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;
const Coin = db.coin;

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to chintan application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/blog.routes')(app);
require('./app/routes/coin.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
  
  Role.create({
    id: 2,
    name: "moderator"
  });
  
  Role.create({
    id: 3,
    name: "admin"
  });

  Coin.create({
    id: 1,
    name:"Bitcoin",
    icon: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
    symbol:"btc",
    price:0,
    price24h: 0,
    chart7d:"yes"
  });
  
  Coin.create({
    id: 2,
    name:"Ethereum",
    icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    symbol:"eth",
    price:0,
    price24h: 0,
    chart7d:"yes"
  });

  Coin.create({
    id: 3,
    name:"Solana",
    icon: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422",
    symbol:"sol",
    price:0,
    price24h: 0,
    chart7d:"yes"
  });
  
  Coin.create({
    id: 4,
    name:"BNB",
    icon: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850",
    symbol:"bnb",
    price:0,
    price24h: 0,
    chart7d:"yes"
  });
}