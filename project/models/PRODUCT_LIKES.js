/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PRODUCT_LIKES', {
    like_no: {
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
    like_enable: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'PRODUCT_LIKES'
  });
};
