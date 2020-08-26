/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LOG_PRODUCTS', {
    log_product_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    product_no: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    user_no: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    log_at: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    log_enable: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'LOG_PRODUCTS'
  });
};
