const Concert = require('../models/Concert');
const parse_v = require('../util/parse_v_error');

const rateValues = Concert.schema.path('rate').enumValues;
const perPage = 6;

const concerts = async (req, res) => {
  const locals = {
    title: 'List of Concerts',
    description: 'A diary of concerts',
  };
  const page = parseInt(req.query.page) || 1;

  try {
    const search = req.query.search || '';
    const searchBy = req.query.searchBy || 'artist';

    const query = {
      createdBy: req.user.id,
    };

    if (searchBy === 'artist') {
      query.artist = { $regex: search, $options: 'i' };
    } else if (searchBy === 'rate') {
      query.rate = { $regex: search, $options: 'i' };
    }

    const totalConcerts = await Concert.countDocuments(query);

    const totalPages = Math.ceil(totalConcerts / perPage);

    const concertList = await Concert.find(query)
      .sort({ _id: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.render('pages/concerts', {
      locals,
      currentPage: page,
      totalPages,
      concerts: concertList,
      errors: req.flash('error'),
      info: req.flash('info'),
    });
  } catch (error) {
    req.flash('error', 'There was an issue displaying the concerts');
    res.redirect('/');
  }
};
const newConcert = (req, res) => {
  const locals = {
    title: 'Add a Concert Entry',
    description: 'A diary of concerts',
  };
  const concertValues = {
    title: '',
    artist: '',
    review: '',
    rate: '',
    action: '/concerts/add',
    submit: 'Add',
    name: 'Add a Concert Entry',
  };
  res.render('pages/concert', {
    locals,
    rateValues,
    concertValues,
    errors: req.flash('error'),
    info: req.flash('info'),
  });
};

const addConcert = async (req, res, next) => {
  try {
    await Concert.create({
      title: req.body.title,
      artist: req.body.artist,
      review: req.body.review,
      rate: req.body.rate,
      createdBy: req.user.id,
    });
  } catch (e) {
    if (e.name === 'ValidationError') {
      parse_v(e, req);
      const concertValues = {
        title: req.body.title,
        artist: req.body.artist,
        review: req.body.review,
        rate: req.body.rate,
        action: '/concerts/add',
        submit: 'Add',
        name: 'Add a Concert Entry',
      };
      return res.render('pages/concert', {
        rateValues,
        concertValues,
        errors: req.flash('error'),
        info: req.flash('info'),
      });
    } else {
      return next(e);
    }
  }
  req.flash('info', 'Concert entry added.');
  res.redirect('/concerts');
};

const editConcert = async (req, res) => {
  const locals = {
    title: 'Edit Concert Entry',
    description: 'A diary of concerts',
  };
  const thisConcert = await Concert.findOne({
    _id: req.params.concert,
    createdBy: req.user.id,
  });
  if (!thisConcert) {
    req.flash('error', 'Concert entry not found.');
    return res.redirect('/concerts');
  }
  const concertValues = {};
  concertValues.title = thisConcert.title || '';
  concertValues.artist = thisConcert.artist || '';
  concertValues.review = thisConcert.review || '';
  concertValues.rate = thisConcert.rate || '';
  concertValues.action = `/concerts/update/${thisConcert._id}`;
  concertValues.submit = 'Update';
  concertValues.name = 'Edit Concert Entry';
  res.render('pages/concert', {
    locals,
    rateValues,
    concertValues,
    errors: req.flash('error'),
    info: req.flash('info'),
  });
};

const updateConcert = async (req, res, next) => {
  let thisConcert = null;
  try {
    thisConcert = await Concert.findOneAndUpdate(
      {
        _id: req.params.concert,
        createdBy: req.user.id,
      },
      req.body,
      { runValidators: true }
    );
  } catch (e) {
    if (e.name === 'ValidationError') {
      parse_v(e, req);
      const concertValues = {};
      concertValues.title = req.body.title;
      concertValues.artist = req.body.artist;
      concertValues.review = req.body.review;
      concertValues.rate = req.body.rate;
      concertValues.action = `/concerts/update/${req.params.concert}`;
      concertValues.submit = 'Update';
      concertValues.name = 'Edit Concert Entry';
      return res.render('pages/concert', {
        rateValues,
        concertValues,
        errors: req.flash('error'),
        info: req.flash('info'),
      });
    } else {
      return next(e);
    }
  }
  if (thisConcert) {
    req.flash('info', 'Concert entry updated.');
  } else {
    req.flash('error', 'Concert entry not found.');
  }
  res.redirect('/concerts');
};

const deleteConcert = async (req, res, next) => {
  const thisConcert = await Concert.findOneAndDelete({
    _id: req.params.concert,
    createdBy: req.user.id,
  });
  if (!thisConcert) {
    req.flash('error', 'Concert entry not found.');
  } else {
    req.flash('info', 'Concert entry deleted.');
  }
  res.redirect('/concerts');
};

module.exports = {
  concerts,
  newConcert,
  addConcert,
  editConcert,
  updateConcert,
  deleteConcert,
};
