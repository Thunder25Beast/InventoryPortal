'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Order', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      item: {
        type: Sequelize.INTEGER, // Change to INTEGER
        allowNull: false,
        references: {
          model: 'Item',
          key: 'id'
        }
      },
      Student: {
        type: Sequelize.INTEGER, // Change to INTEGER
        allowNull: false,
        references: {
          model: 'Student',
          key: 'id'
        }
      },
      issuedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(`CURRENT_DATE + INTERVAL '14 DAY'`)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Order');
  }
};
