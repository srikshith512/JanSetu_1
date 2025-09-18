const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Issue extends Model {}

Issue.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    trackingId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'resolved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
      allowNull: false,
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      // Expect an array of { filename, url, mimetype, size }
    },
    audioNote: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reportedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactInfo: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    assignedTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Issue',
    tableName: 'issues',
    indexes: [
      { fields: ['status'] },
      { fields: ['priority'] },
      { fields: ['category'] },
      { unique: true, fields: ['trackingId'] },
    ],
    hooks: {
      beforeValidate: (issue) => {
        if (!issue.trackingId) {
          const short = uuidv4().split('-')[0].toUpperCase();
          issue.trackingId = `JS-${short}`;
        }
      },
    },
  }
);

module.exports = Issue;
