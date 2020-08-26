/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('USER_TICKETS', {
    user_ticket_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    user_no: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ticket_no: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ticket_quantity: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ticket_total_price: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ticket_discount: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    },
    ticket_purchase_at: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    user_ticket_enable: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'USER_TICKETS'
  });
};
