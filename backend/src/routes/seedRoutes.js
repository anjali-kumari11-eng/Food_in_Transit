const express = require('express');
const { seedData } = require('../controllers/seedController');

const router = express.Router();

router.post('/', seedData);

module.exports = router;
