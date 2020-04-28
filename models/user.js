'use strict';
module.exports = (sequelize, DataTypes) => {
  const crypto = require('crypto');
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.NUMBER,
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    tel: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    // associations can be defined here
  };
  User.newSalt = () => {
    return crypto.randomBytes(16).toString('hex');
  };
  User.getStorePassword = (password, salt) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).update(salt).digest('base64');
    return hash;
  };
  User.prototype.validPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).update(this.salt).digest('base64');
    return this.password == hash;
  };
  User.prototype.setPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).update(this.salt).digest('base64');
    this.password = hash;
  };
  return User;
};