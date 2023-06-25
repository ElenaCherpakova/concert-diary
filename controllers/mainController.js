const homePage = async (req, res) => {
  const locals = {
    title: 'Concert Diary',
    description: 'A diary of concerts',
  };
  res.render('pages/index', { locals });
};
const aboutPage = async (req, res) => {
  const locals = {
    title: 'About Concert Diary',
    description: 'A diary of concerts',
  }
  res.render('pages/about', { locals });
};

module.exports = {
  homePage,
  aboutPage,
};
