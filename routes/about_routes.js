const express = require('express');
const router = express.Router();

const { aboutPage } = require('../controllers/aboutController');

router.get('/', aboutPage);

module.exports = router;