'use strict';

const { Model, DataTypes } = require("sequelize");
const crypto = require('crypto');

// change acording to https://codewithhugo.com/using-es6-classes-for-sequelize-4-models/
// todo: change import to js require

class User extends Model {
  static init(sequelize) {
    return super.init({
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      surname: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, validate: { isEmail: true } },
      role: {type: DataTypes.INTEGER, allowNull: false},
      password: {type: DataTypes.STRING, allowNull: false},
      salt: {type: DataTypes.STRING, allowNull: false},
      tel: DataTypes.STRING
    }, { sequelize });
  }
  static associate(models) {
    this.hasOne(models.Group, { foreignKey: 'head_id' });
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
module.exports = User;