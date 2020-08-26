/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LOG_USE_TICKETS', {
    log_use_ticket_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    user_ticket_no: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ticket_used_at: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    use_ticket_enable: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'LOG_USE_TICKETS'
  });
};
