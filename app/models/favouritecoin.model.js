module.exports = (sequelize, Sequelize) => {
  const FavouriteCoins = sequelize.define("favouritecoins", {
    userid: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    favcoins: {
      type: Sequelize.TEXT('long'),
      allowNull: true
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

  return FavouriteCoins;
};
