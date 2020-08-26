/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('USER_COUPONS', {
    user_coupon_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    user_no: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    coupon_no: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    user_coupon_enable: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 1
    },
    get_coupon_at: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'USER_COUPONS'
  });
};
