'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('members', 'profile_image', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('members', 'profile_image');
  }
};