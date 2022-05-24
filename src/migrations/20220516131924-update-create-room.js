'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Rooms',
      'channelUrl',
      {
        type: Sequelize.DataTypes.STRING,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Rooms', 'channelUrl');

  }
};
