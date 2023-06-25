const User = require('../models/User');
const parse_v = require('../util/parse_v_error');

const renderIndex = (req, res) => {
  const locals = {
    title: 'Concert Diary',
    description: 'A diary of concerts',
  };
  if (req.user) {
    return res.redirect('/concerts');
  }
  res.render('pages/index', {
    locals,
    errors: req.flash('error'),
    info: req.flash('info'),
  });
};

const renderSignUp = (req, res) => {
  const locals = {
    title: 'Sign Up',
    description: 'Sign up for Concert Diary',
  };
  res.render('pages/sign-up-form', {
    userValues: {},
    locals,
    errors: req.flash('error'),
    info: req.flash('info'),
  });
};

const signUp = async (req, res, next) => {
  let error_state = false;
  const userDoc = new User(req.body);
  const userValues = { name: req.body.name, email: req.body.email };
  try {
    await userDoc.validate();
  } catch (e) {
    error_state = true;
    if (e.name === 'ValidationError') {
      parse_v(e, req);
    } else {
      return next(e);
    }
  }
  if (req.body.password !== req.body.password_confirm) {
    error_state = true;
    req.flash('error', 'The passwords entered do not match.');
  }
  if (error_state === true) {
    return res.render('pages/sign-up-form', {
      userValues,
      errors: req.flash('error'),
      info: req.flash('info'),
    });
  }
  try {
    await User.create(req.body);
  } catch (e) {
    if (e.name === 'MongoServerError' && e.code === 11000) {
      req.flash('error', 'That email address is already registered.');
    } else {
      return next(e);
    }
    return res.render('pages/sign-up-form', {
      userValues,
      errors: req.flash('error'),
      info: req.flash('info'),
    });
  }
  return res.redirect('/concerts');
};

const logOut = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
};

const logon = (req, res) => {
  const locals = {
    title: 'Log On',
    description: 'Log on to Concert Diary',
  };
  if (req.user) {
    return res.redirect('/concerts');
  }
  res.render('pages/logon', {
    locals,
    errors: req.flash('error'),
    info: req.flash('info'),
  });
};

module.exports = {
  renderIndex,
  renderSignUp,
  signUp,
  logOut,
  logon,
};
