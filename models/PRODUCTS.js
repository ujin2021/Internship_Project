/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PRODUCTS', {
    product_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    product_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    product_introduce: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    product_location: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    category_no: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    product_thumbnail: {
      type: 'BLOB',
      allowNull: true
    },
    product_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    product_enable: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 1
    },
    view_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    like_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    review_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    evaluation_total: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'PRODUCTS',
    timestamps :false
  });
};
