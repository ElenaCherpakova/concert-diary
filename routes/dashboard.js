const express = require('express');
const router = express.Router();

const { dashboardPage } = require('../controllers/dashboardController');


router.route('/dashboard').get(dashboardPage)

module.exports = router;