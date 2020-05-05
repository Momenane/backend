'use strict';

const { Model, DataTypes } = require("sequelize");

class GroupMembers extends Model {
  static init(sequelize) {
    return super.init({
      name: DataTypes.STRING,
      surname: DataTypes.STRING,
      is_households: DataTypes.BOOLEAN,
      tel: DataTypes.STRING,
      national_code: DataTypes.STRING,
      city_area: DataTypes.INTEGER,
      address: DataTypes.TEXT,
      family_members: DataTypes.INTEGER,
      haveHouse: DataTypes.BOOLEAN,
      monthly_salary: DataTypes.BIGINT,
      birth_date: DataTypes.STRING,
      group_id: DataTypes.INTEGER,
    }, { sequelize });
  }
  static associate(models) {
    this.belongsTo(models.Group);
  }
}

module.exports = GroupMembers;
