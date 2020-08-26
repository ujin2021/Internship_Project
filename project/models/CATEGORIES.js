/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CATEGORIES', {
    category_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    category_icon: {
      type: 'BLOB',
      allowNull: true
    },
    category_name: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    category_enable: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'CATEGORIES'
  });
};
