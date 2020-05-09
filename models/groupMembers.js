'use strict';

const { Model, DataTypes } = require("sequelize");

const SexEnum = DataTypes.ENUM(['None', 'Men', 'Women']);
const MaritalStatus = DataTypes.ENUM(['None', 'Single', 'Married'])

// indigent;
class GroupMembers extends Model {
  static init(sequelize) {
    return super.init({
      name: { type: DataTypes.STRING, allowNull: false },
      surname: { type: DataTypes.STRING, allowNull: false },
      birth_date: DataTypes.STRING,
      sex: { type: SexEnum, allowNull: false, defaultValue: 'None' },
      national_code: { type: DataTypes.STRING, allowNull: false, is: /^[0-9]+$/ },
      marital: { type: MaritalStatus, allowNull: false, defaultValue: 'None' },
      is_households: { type: DataTypes.BOOLEAN, allowNull: false },
      family_parent_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: -1 },
      family_names: DataTypes.STRING,
      tels: { type: DataTypes.STRING, allowNull: false, is: /^[0-9\+-,]+$/ }, // comma seprated
      email: { type: DataTypes.STRING, validate: { isEmail: true } },
      city_area: { type: DataTypes.INTEGER, allowNull: false },
      address: { type: DataTypes.TEXT, allowNull: false },
      have_house: { type: DataTypes.BOOLEAN, allowNull: false },
      job: { type: DataTypes.STRING, allowNull: true },
      monthly_salary: DataTypes.BIGINT,
      group_id: { type: DataTypes.INTEGER, allowNull: false },
      register_id: { type: DataTypes.INTEGER, allowNull: false },
      other_organization: DataTypes.STRING,
    }, { sequelize });
  }
  static associate(models) {
    this.hasMany(models.DonateHistory, { foreignKey: 'member_id' });
    this.belongsTo(models.Group);
  }
}

module.exports = GroupMembers;
