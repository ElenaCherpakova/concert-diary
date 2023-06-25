const parse_v = (e, req) => {
  const keys = Object.keys(e.errors);
  keys.forEach((key) => {
    req.flash('error', e.errors[key].properties.message);
  });
};
module.exports = parse_v;
