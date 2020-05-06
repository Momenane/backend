'use strict';

const { Model, DataTypes } = require("sequelize");

class GroupMembers extends Model {
  static init(sequelize) {
    return super.init({
      name: {type : DataTypes.STRING , allowNull : false},
      surname: {type : DataTypes.STRING , allowNull : false},
      is_households: {type: DataTypes.BOOLEAN , allowNull : false},
      tel:{type:DataTypes.STRING , allowNull : false} ,
      national_code: {type: DataTypes.STRING , allowNull : false},
      city_area: {type : DataTypes.INTEGER , allowNull : false},
      address: {type: DataTypes.TEXT , allowNull : false},
      family_members:{type:DataTypes.INTEGER , allowNull : false} ,
      haveHouse: {type:DataTypes.BOOLEAN , allowNull : false},
      monthly_salary:{type : DataTypes.BIGINT , allowNull : true} ,
      birth_date: {type : DataTypes.STRING , allowNull : true},
      group_id: {type : DataTypes.INTEGER , allowNull : false},
    }, { sequelize });
  }
  static associate(models) {
    this.hasMany(models.donateHistory , {foreignKey : 'member_id'});
    this.belongsTo(models.Group);
  }
}

module.exports = GroupMembers;
