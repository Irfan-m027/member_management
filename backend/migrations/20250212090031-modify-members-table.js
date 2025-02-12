'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.renameColumn('Members', 'firstName', 'first_name'),
      queryInterface.renameColumn('Members', 'lastName', 'last_name'),

      queryInterface.addColumn('Members', 'status', {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),
        allowNull: false,
        defaultValue: 'active'
      }),

      queryInterface.addColumn('Members', 'last_login', {
        type: Sequelize.DATE,
        allowNull: true,
      })
    ]); 
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.renameColumn('Members', 'last_name', 'lastName'),
      queryInterface.renameColumn('Members', 'first_name', 'firstName'),

      queryInterface.removeColumn('Members', 'status'),
      queryInterface.removeColumn('Members', 'last_login')
    ]);
  }
};