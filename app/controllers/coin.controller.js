const https = require('https');
const axios = require('axios');
const db = require("../models");
const config = require("../config/auth.config");
const Coin = db.coin;
const FavouriteCoin = db.favouritecoin;
const Op = db.Sequelize.Op;

exports.getCoinsList = (req, res) => {
  console.log('till here')
  https.get('https://api.coingecko.com/api/v3/coins/list', (response) => {
    let data = '';
  
    response.on('data', (chunk) => {
      data += chunk;
    });
  
    response.on('end', () => {
      const coins = JSON.parse(data);
      res.status(200).send(coins);
    });
  
  }).on('error', (err) => {
    console.error(err);
  });
};

exports.setCoinsDetails = (req, res) => {
  https.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin', (response) => {
    let data = '';
  
    response.on('data', (chunk) => {
      data += chunk;
    });
  
    response.on('end', () => {
      Coin.findAll().then((coins) => {
        const livecoins = JSON.parse(data);
        livecoins.forEach(livecoin => {
            if(coins.length===4){
              console.log(livecoin.current_price)
              Coin.update({
                icon:livecoin.image,
                name:livecoin.name,
                symbol:livecoin.symbol,
                price:livecoin.current_price,
                price24h: livecoin.price_change_percentage_24h,
                chart7d:"yes"
              },{
                where: {
                  name: livecoin.name
                }
              });      
            }else{
              Coin.create({
                icon:livecoin.image,
                name:livecoin.name,
                symbol:livecoin.symbol,
                price:livecoin.current_price,
                price24h: livecoin.price_change_percentage_24h,
                chart7d:"yes"
              });
            }
          });
      })
      .catch((error) => {
        console.log(error);
      });
      res.status(200).send("success");
    });  
  }).on('error', (err) => {
    console.error(err);
  });
};

exports.getCoinsDetails = (req, res) => {
  Coin.findAll().then((coins) => {
    res.status(200).send({data:coins});
  })
  .catch((error) => {
    console.log(error);
  });
};

exports.addFavCoins = (req, res) => {
  console.log(JSON.stringify(req.body.userid),"data")
  console.log(JSON.stringify(req.body.userid),"data")
  FavouriteCoin.upsert({
    userid: req.body.userid,
    favcoins: JSON.stringify(req.body.favcoins)
  }).then(result => {
    console.log(result);
    res.status(200).send({data:result});
  }).catch(error => {
    console.log(error);
  });
};

exports.getFavCoins = (req, res) => {
  console.log(JSON.stringify(req.body.userid),"data")
  FavouriteCoin.findOne({
    where: {
      userid: req.body.userid
    }
  })
  .then(async (data) => {
      res.status(200).send({
        data: JSON.parse(data.favcoins),
      });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};

//
// exports.setCoinsDetails = (req, res) => {
//   Coin.findAll().then((coins) => {
//     const urls = [
//       'https://api.coingecko.com/api/v3/coins/bitcoin',
//       'https://api.coingecko.com/api/v3/coins/ethereum',
//       'https://api.coingecko.com/api/v3/coins/solana',
//       'https://api.coingecko.com/api/v3/coins/binancecoin'
//     ];
//       urls.forEach(async (url) => {
//         try {
//           const response = await axios.get(url);
//           if(coins.length===4){
//             Coin.update({
//               icon:response.data.image.thumb,
//               name:response.data.name,
//               symbol:response.data.symbol,
//               price:response.data.market_data.current_price.usd,
//               price24h: response.data.market_data.price_change_percentage_24h,
//               chart7d:response.data.market_data.price_change_percentage_7d
//             },{
//               where: {
//                 name: response.data.name
//               }
//             });      
//           }else{
//             Coin.create({
//               icon:response.data.image.thumb,
//               name:response.data.name,
//               symbol:response.data.symbol,
//               price:response.data.market_data.current_price.usd,
//               price24h: response.data.market_data.price_change_percentage_24h,
//               chart7d:response.data.market_data.price_change_percentage_7d
//             });
//           }
//         } catch (error) {
//           console.error(error);
//         }
//       });
//       res.status(200).send({message:`Coin inserted into the database`});
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// };