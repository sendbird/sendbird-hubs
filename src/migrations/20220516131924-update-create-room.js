'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Room',
      'channelUrl',
      {
        type: Sequelize.DataTypes.STRING,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Room', 'channelUrl');

  }
};
