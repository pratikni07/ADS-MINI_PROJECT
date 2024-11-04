const { getModels } = require('../models/data.model');
const { backupData } = require('../utils/backup');

let usePrimaryDB = true;

const dataController = {
  toggleDatabase: (req, res) => {
    try {
      usePrimaryDB = !usePrimaryDB;
      res.json({ 
        success: true,
        message: `Switched to ${usePrimaryDB ? 'primary' : 'secondary'} database`,
        currentDatabase: usePrimaryDB ? 'primary' : 'secondary'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  createData: async (req, res) => {
    try {
      const { PrimaryData, SecondaryData } = getModels();
      
      // Validate request body
      if (!req.body.title || !req.body.content) {
        return res.status(400).json({
          success: false,
          error: 'Title and content are required'
        });
      }

      // Create in primary database
      const newData = await PrimaryData.create(req.body);
      
      // Replicate to secondary
      await SecondaryData.create(req.body);
      
      res.json({
        success: true,
        data: newData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  getData: async (req, res) => {
    try {
      const { PrimaryData, SecondaryData } = getModels();
      
      const data = usePrimaryDB ? 
        await PrimaryData.find({}).sort('-createdAt') : 
        await SecondaryData.find({}).sort('-createdAt');
      
      res.json({
        success: true,
        currentDatabase: usePrimaryDB ? 'primary' : 'secondary',
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  manualBackup: async (req, res) => {
    try {
      const result = await backupData();
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = dataController;
