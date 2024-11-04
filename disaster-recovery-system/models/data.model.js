const mongoose = require('mongoose');
const { getConnections } = require('../config/db.config');

const dataSchema = new mongoose.Schema({
  title: String,
  content: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const getModels = () => {
  const { primaryConnection, secondaryConnection } = getConnections();
  
  const PrimaryData = primaryConnection.model('Data', dataSchema);
  const SecondaryData = secondaryConnection.model('Data', dataSchema);
  
  return { PrimaryData, SecondaryData };
};

module.exports = { getModels };