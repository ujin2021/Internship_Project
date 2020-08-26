/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LOG_USE_COUPONS', {
    log_use_coupon_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    user_ticket_no: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    user_coupon_no: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    coupon_used_at: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    use_coupon_enable: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'LOG_USE_COUPONS'
  });
};
