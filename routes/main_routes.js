const express = require('express');
const router = express.Router();

const { aboutPage } = require('../controllers/aboutController');

router.route('/about').get(aboutPage);

module.exports = router;
