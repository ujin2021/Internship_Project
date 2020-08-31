/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TICKETS', {
    ticket_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    ticket_name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    ticket_use_period: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    ticket_price: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ticket_enable: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 1
    },
    product_no: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    available_use: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'TICKETS',
    timestamps :false
  });
};
