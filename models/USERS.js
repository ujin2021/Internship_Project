/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('USERS', {
    user_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    user_email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    user_password: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    user_nickname: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    user_phone: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    user_location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    user_enable: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'USERS',
    timestamps :false
  });
};
