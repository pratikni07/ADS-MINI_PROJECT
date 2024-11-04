const express = require('express');
const cors = require('cors');
const { connectDatabases } = require('./config/db.config');
const { scheduleBackups } = require('./utils/backup');
require('dotenv').config();

const startServer = async () => {
  try {
    const app = express();
    
    // Middleware
    app.use(cors());
    app.use(express.json());

    // Connect to databases
    await connectDatabases();
    
    // Initialize backup scheduler
    scheduleBackups();

    // Routes
    app.use('/api/data', require('./routes/data.routes'));

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        success: false,
        error: 'Something went wrong!'
      });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();