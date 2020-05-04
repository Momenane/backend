'use strict';

module.exports = (sequelize, DataTypes) => {
    const GroupMembers = sequelize.define('GroupMembers', {
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        is_households: DataTypes.BOOLEAN,
        tel : DataTypes.STRING,
        national_code : DataTypes.STRING,
        city_area : DataTypes.INTEGER,
        address : DataTypes.TEXT,
        family_members : DataTypes.INTEGER,
        haveHouse : DataTypes.BOOLEAN,
        monthly_salary: DataTypes.BIGINT,
        birth_date: DataTypes.STRING,
        group_id : DataTypes.INTEGER,
    }, {});
    GroupMembers.associate = function (models) {
        GroupMembers.belongsTo(models["Group"]);
    };
    return GroupMembers;
};