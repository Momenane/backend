'use strict';

module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('Group', {
        name: DataTypes.STRING,
        head_id: DataTypes.INTEGER,
        image: DataTypes.STRING,
    }, {});
    Group.associate = function (models) {
        Group.hasMany(models["GroupMembers"] , {foreignKey : 'group_id'});
    };
    return Group;
};