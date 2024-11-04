const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data.controller');

router.post('/create', dataController.createData);
router.get('/all', dataController.getData);
router.post('/toggle-db', dataController.toggleDatabase);
router.post('/manual-backup', dataController.manualBackup);

module.exports = router;
