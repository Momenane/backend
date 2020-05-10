'use strict';

const { Model, DataTypes } = require("sequelize");

class DonateHistory extends Model {
  static init(sequelize) {
    return super.init({
      member_id: { type: DataTypes.INTEGER, allowNull: false },
      plan_id: { type: DataTypes.INTEGER, allowNull: false },
      amount: { type: DataTypes.INTEGER, allowNull: false },
      date: { type: DataTypes.DATE, allowNull: false }
    }, { sequelize });
  }
  static associate(models) {
    this.belongsTo(models.GroupMembers);
    this.belongsTo(models.GroupPlans);
  }
}

module.exports = DonateHistory;
