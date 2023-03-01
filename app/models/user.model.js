module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    email_marketing: {
      type: Sequelize.ENUM('yes', 'no'),
      allowNull: false
    },
    terms_condition: {
      type: Sequelize.ENUM('yes', 'no'),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING
    }
  });

  return User;
};
