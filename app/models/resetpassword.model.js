module.exports = (sequelize, Sequelize) => {
  const Resetpassword = sequelize.define("resetpassword", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userid: {
      type: Sequelize.INTEGER,
      unique:true 
    },
    email: {
      type: Sequelize.STRING,
      unique:true 
    },
    token: {
      type: Sequelize.STRING
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

  return Resetpassword;
};
