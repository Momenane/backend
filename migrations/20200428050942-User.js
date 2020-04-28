'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
     return Promise.all([
      queryInterface.addColumn('Users', 'role',  Sequelize.NUMBER ,{after: 'email'}),
      queryInterface.addColumn('Users', 'salt',  Sequelize.STRING ,{after: 'password'})
     ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'role'),
      queryInterface.removeColumn('Users', 'salt')
     ]);
  }
};
