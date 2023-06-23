const homePage = async (req, res) => {
  const locals = {
    title: 'Concert Diary',
    description: 'A diary of concerts',
  };
    res.render('index', { locals });
};
const aboutPage = async (req, res) => {
    const locals = {
      title: 'About App',
      description: 'about application',
    };
      res.render('about', { locals });
  };

module.exports = {
  homePage,
  aboutPage
};
