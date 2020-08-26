/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('COUPONS', {
    coupon_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    coupon_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    coupon_discount_percent: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    coupon_start_at: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    coupon_end_at: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    coupon_requirement: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    coupon_enable: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 1
    },
    product_no: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'COUPONS'
  });
};
