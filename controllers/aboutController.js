const aboutPage = (req, res) => {
  const locals = {
    title: 'About Concert Diary',
    description: 'A diary of concerts',
  };
  // the fact that this app looks and feels so good and uses EJS makes me very
  // happy, awesome job!
  //
  // continuing with the keep-it-simple camp, check out HTMX, which I think
  // you may like -- https://htmx.org/
  res.render('pages/about', {
    locals,
    errors: req.flash('error'),
    info: req.flash('info'),
  });
};

module.exports = {
  aboutPage,
};
