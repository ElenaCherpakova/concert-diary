const express = require('express');
const router = express.Router();

const { homePage, aboutPage } = require('../controllers/mainController');

router.get('/', homePage);
router.get('/about', aboutPage);

module.exports = router;
