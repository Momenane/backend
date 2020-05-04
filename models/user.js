'use strict';

const { Model } = require("sequelize");

// change acording to https://codewithhugo.com/using-es6-classes-for-sequelize-4-models/
// todo: change import to js require

module.exports = (sequelize, DataTypes) => {
  const crypto = require('crypto');
  class User extends Model {
    static init(sequelize, DataTypes) {
      return super.init({
        username: DataTypes.STRING,
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        email: { type: DataTypes.STRING, validate: { isEmail: true } },
        role: DataTypes.INTEGER,
        password: DataTypes.STRING,
        salt: DataTypes.STRING,
        tel: DataTypes.STRING
      }, { sequelize });
    }
    static associate(models) {
      super.hasOne(models.Group, { foreignKey: 'head_id' });
    }
    static newSalt() {
      return crypto.randomBytes(16).toString('base64');
    }
    static getStorePassword(password, salt) {
      const sha256 = crypto.createHmac('sha256', salt);
      const hash = sha256.update(password).digest('base64');
      return hash;
    }
    validPassword(password) {
      const sha256 = crypto.createHmac('sha256', this.salt);
      const hash = sha256.update(password).digest('base64');
      return this.password == hash;
    }
    setPassword(password) {
      const sha256 = crypto.createHmac('sha256', this.salt);
      const hash = sha256.update(password).digest('base64');
      this.password = hash;
    }
  }
  User.init(sequelize, DataTypes);
  return User;
};