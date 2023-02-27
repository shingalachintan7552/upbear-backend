module.exports = (sequelize, Sequelize) => {
  const Coin = sequelize.define("coins", {
    icon: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    symbol: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.FLOAT
    },
    price24h: {
      type: Sequelize.FLOAT
    },
    chart7d: {
      type: Sequelize.FLOAT
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      onUpdate : Sequelize.NOW,
      field: 'updated_at',
    },
  });

  return Coin;
};
