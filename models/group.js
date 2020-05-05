'use strict';

const { Model, DataTypes } = require("sequelize");

class Group extends Model {
  static init(sequelize) {
    return super.init({
      name: DataTypes.STRING,
      head_id: DataTypes.INTEGER,
      image: DataTypes.STRING,
    }, { sequelize });
  }
  static associate(models) {
    this.hasMany(models.GroupMembers, { foreignKey: 'group_id' });
  }
}

module.exports = Group;