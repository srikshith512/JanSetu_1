'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('issues', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true,
      },
      trackingId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'in_progress', 'resolved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        allowNull: false,
        defaultValue: 'medium',
      },
      location: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      images: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      audioNote: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reportedBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contactInfo: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      assignedTo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('issues');
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_issues_status\"");
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_issues_priority\"");
  },
};
