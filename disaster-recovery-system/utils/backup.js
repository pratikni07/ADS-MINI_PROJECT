const cron = require('node-cron');
const { getModels } = require('../models/data.model');

const backupData = async () => {
  try {
    const { PrimaryData, SecondaryData } = getModels();
    
    // Get all data from primary database
    const primaryData = await PrimaryData.find({});
    
    if (!primaryData || primaryData.length === 0) {
      console.log('No data to backup in primary database');
      return;
    }

    // Clear secondary database
    await SecondaryData.deleteMany({});
    console.log('Secondary database cleared');

    // Insert data into secondary database
    const insertResult = await SecondaryData.insertMany(primaryData);
    console.log(`Backup completed successfully. ${insertResult.length} documents copied.`);

    return {
      success: true,
      message: `Backup completed successfully. ${insertResult.length} documents copied.`
    };
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
};

// Schedule backup every hour
const scheduleBackups = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      await backupData();
    } catch (error) {
      console.error('Scheduled backup failed:', error);
    }
  });
  console.log('Backup scheduler initialized');
};

module.exports = { backupData, scheduleBackups };
