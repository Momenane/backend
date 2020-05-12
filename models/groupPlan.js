'use strict';

const { Model, DataTypes } = require("sequelize");

class GroupPlan extends Model {
  static init(sequelize) {
    return super.init({
      group_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      donation: { type: DataTypes.STRING, allowNull: false },
      target: { type: DataTypes.STRING, allowNull: false },
      amount: { type: DataTypes.INTEGER, allowNull: false },
      notes: DataTypes.TEXT,
      document: DataTypes.TEXT,
    }, { sequelize });
  }

  static associate(models) {
    this.hasMany(models.DonateHistory, { foreignKey: 'plan_id' });
    this.belongsTo(models.Group, { foreignKey: 'group_id' });
  }
}

module.exports = GroupPlan;
