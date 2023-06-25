const express = require('express');
const passport = require('passport');
const router = express.Router();
const { refreshCSRF } = require('../middleware/auth');

const {
  renderIndex,
  renderSignUp,
  signUp,
  logOut,
  logon,
} = require('../controllers/pageController');

router.route('/').get(renderIndex);
router.route('/sign-up').get(renderSignUp).post(signUp);

router
  .route('/logon')
  .get(logon)
  .post(
    passport.authenticate('local', {
      successRedirect: '/concerts',
      failureRedirect: '/logon',
      failureFlash: true,
    }),
    refreshCSRF
  );
router.route('/logout').get(logOut);

module.exports = router;
