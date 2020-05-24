'use strict';

const { Model, DataTypes } = require("sequelize");
const crypto = require('crypto');
const permission = require('./permission');

// change acording to https://codewithhugo.com/using-es6-classes-for-sequelize-4-models/

const PermissionEnum = DataTypes.ENUM([
  Object.values(permission)
]);

class User extends Model {
  static init(sequelize) {
    return super.init({
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      salt: { type: DataTypes.STRING, allowNull: false },
      role: { type: PermissionEnum, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
      tel: { type: DataTypes.STRING, validate: { is: /^[0-9\+,-]+$/ } },
      address: DataTypes.STRING,
    }, { sequelize });
  }
  static associate(models) {
    // this.hasOne(models.Group, { foreignKey: 'head_id' });
    this.belongsTo(models.Group, { foreignKey: 'group_id' });
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
  static passportSerialize(user, done) {
    done(null, { id: user.id, role: user.role });
  }
  static passportDeserialize(userInfo, done) {
    User.findOne({ where: { id: userInfo.id } })
      .then(user => done(null, user))
      .catch(err => done(err, null));
  }
  static passportLogin(username, password, done) {
    User.findOne({
      attributes: ['id', 'role', 'password', 'salt', 'group_id'],
      where: { username }
    }).then((user) => {
      if (user != null) {//&& user instanceof User
        var res = user.validPassword(password);
        if (!res)
          return done(null, false, { message: 'Incorrect password.' });
        return done(null, user);
      }
      else { return done('error'); }
    }).catch(() => done(null, false, { message: 'Incorrect username.' }));
  }
}
module.exports = User;
