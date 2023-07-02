const aboutPage = (req, res) => {
  const locals = {
    title: 'About Concert Diary',
    description: 'A diary of concerts',
  };
  res.render('pages/about', {
    locals,
    errors: req.flash('error'),
    info: req.flash('info'),
  });
};

module.exports = {
  aboutPage,
};
