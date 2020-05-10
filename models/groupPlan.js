'use strict';

const { Model, DataTypes } = require("sequelize");

class GroupPlan extends Model {
  static init(sequelize) {
    return super.init({
      name: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      donation: { type: DataTypes.STRING, allowNull: false },
      total: { type: DataTypes.STRING, allowNull: false },
      amount: { type: DataTypes.INTEGER, allowNull: false },
      notes: DataTypes.TEXT,
      document: DataTypes.TEXT,
    }, { sequelize });
  }

  static associate(models) {
    this.hasMany(models.DonateHistory, { foreignKey: 'plan_id' });
  }
}

module.exports = GroupPlan;
