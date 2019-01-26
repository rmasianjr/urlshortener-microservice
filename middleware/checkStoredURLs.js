const Link = require('../models/Link');

module.exports = (req, res, next) => {
  const { cleanURL } = req;

  Link.findOne({ original_url: cleanURL })
    .then(doc => {
      if (doc) {
        const { original_url, short_url } = doc;
        return res.json({ original_url, short_url });
      } else {
        next();
      }
    })
    .catch(err => res.json({ error: err.message }));
};
