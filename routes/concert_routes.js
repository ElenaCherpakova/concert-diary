const express = require('express');
const router = express.Router();

const {
  concerts,
  newConcert,
  addConcert,
  editConcert,
  updateConcert,
  deleteConcert,
} = require('../controllers/concertsController');

router.route('/').get(concerts);
router.route('/add').get(newConcert).post(addConcert);
router.route('/edit/:concert').get(editConcert);
router.route('/update/:concert').post(updateConcert);
router.route('/delete/:concert').delete(deleteConcert);

module.exports = router;
