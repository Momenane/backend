'use strict';

const { Model, DataTypes } = require("sequelize");

class Group extends Model {
  static init(sequelize) {
    return super.init({
      name: { type: DataTypes.STRING, allowNull: false },
      head_id: DataTypes.INTEGER,
      location: DataTypes.STRING,
      address: { type: DataTypes.STRING, allowNull: false },
      site: { type: DataTypes.STRING, validate: { isUrl: true } },
      email: { type: DataTypes.STRING, validate: { isEmail: true } },
      tel: { type: DataTypes.STRING, validate: { is: /^[0-9\+,-]+$/ } },
      social_link: DataTypes.STRING, // string list
      register_number: DataTypes.STRING,
      target_region: DataTypes.STRING,
      image: DataTypes.STRING,
    }, { sequelize });
  }
  static associate(models) {
    this.hasMany(models.GroupMember, { foreignKey: 'group_id' });
    this.hasMany(models.GroupPlan, { foreignKey: 'group_id' });
    this.hasMany(models.User, { foreignKey: 'group_id', constraints: false, allowNull: true, defaultValue: null });
    // this.belongsTo(models.User);
  }
}

module.exports = Group;