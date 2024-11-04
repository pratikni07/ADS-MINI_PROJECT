const mongoose = require('mongoose');
require('dotenv').config();

let primaryConnection = null;
let secondaryConnection = null;

const connectDatabases = async () => {
  try {
    primaryConnection = await mongoose.createConnection(process.env.PRIMARY_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Primary database connected successfully');

    secondaryConnection = await mongoose.createConnection(process.env.SECONDARY_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Secondary database connected successfully');

    return { primaryConnection, secondaryConnection };
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const getConnections = () => {
  if (!primaryConnection || !secondaryConnection) {
    throw new Error('Database connections not initialized');
  }
  return { primaryConnection, secondaryConnection };
};

module.exports = { connectDatabases, getConnections };
