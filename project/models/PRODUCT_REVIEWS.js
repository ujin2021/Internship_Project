/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PRODUCT_REVIEWS', {
    product_review_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    user_no: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    product_no: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    review_created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    review_title: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    review_content: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    review_evaluation: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    review_image: {
      type: 'BLOB',
      allowNull: true
    },
    review_enable: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'PRODUCT_REVIEWS'
  });
};
