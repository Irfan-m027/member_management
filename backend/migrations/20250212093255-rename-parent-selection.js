'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Members');
    
    if (tableInfo.parentSelection) {
      await queryInterface.renameColumn('Members', 'parentSelection', 'parent_id');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Members');
    
    if (tableInfo.parent_selection) {
      await queryInterface.renameColumn('Members', 'parent_id', 'parentSelection');
    }
  }
};