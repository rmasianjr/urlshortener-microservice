const Link = require('../models/Link');

module.exports = async (req, res, next) => {
  try {
    const { cleanURL } = req;

    const link = await Link.findOne({ original_url: cleanURL });
    if (link) {
      const { original_url, short_url } = link;
      return res.json({ original_url, short_url });
    }

    next();
  } catch (e) {
    return res.json({ error: e.message });
  }
};
