'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    // return (file.indexOf('.') !== 0) && (file !== "index.js");
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // const model = require(path.join(__dirname, file));
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
    console.log('model.name', model.name);
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.USERS = ('./users')(sequelize, Sequelize)
// db.USER_TICKETS = ('./user_tickets')(sequelize, Sequelize)
// db.USER_COUPONS = ('./user_coupons')(sequelize, Sequelize)
// db.USER_TICKETS = ('./user_tickets')(sequelize, Sequelize)
// db.PRODUCTS = ('./products')(sequelize, Sequelize)
// db.PRODUCT_REVIEWS = ('./product_reviews')(sequelize, Sequelize)
// db.PRODUCT_LIKES = ('./product_likes')(sequelize, Sequelize)
// db.LOG_USE_TICKETS = ('./log_use_tickets')(sequelize, Sequelize)
// db.LOG_USE_COUPONS = ('./log_use_coupons')(sequelize, Sequelize)
// db.LOG_PRODUCTS = ('./log_products')(sequelize, Sequelize)
// db.LOG_USE_COUPONS = ('./log_use_coupons')(sequelize, Sequelize)
// db.CATEGORY = ('./category')(sequelize, Sequelize)

module.exports = db;
