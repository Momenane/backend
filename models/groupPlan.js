'use strict';

const { Model, DataTypes } = require("sequelize");

class GroupPlan extends Model {
    static init(sequelize) {
        return super.init({
            name: {type : DataTypes.STRING , allowNull : false},
            type: {type : DataTypes.STRING , allowNull : false},
            notes: {type: DataTypes.TEXT , allowNull : true},
            donation:{type:DataTypes.STRING , allowNull : false} ,
            total: {type: DataTypes.STRING , allowNull : false},
            amount: {type : DataTypes.INTEGER , allowNull : false},
            document: {type: DataTypes.TEXT , allowNull : true},
        }, { sequelize });
    }

    static associate(models) {
        this.hasMany(models.DonateHistory , {foreignKey : 'plan_id'});
    }
}

module.exports = GroupPlan;
