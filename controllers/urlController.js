const dns = require('dns');
const { promisify } = require('util');

const Link = require('../models/Link');

exports.registerURL = async (req, res) => {
  try {
    const { cleanURL, hostName } = req;
    const lookupPromise = promisify(dns.lookup);

    await lookupPromise(hostName).catch(err => {
      throw new Error('invalid HostName');
    });
    const count = await Link.countDocuments({});
    const link = new Link({ original_url: cleanURL, short_url: count + 1 });
    const { original_url, short_url } = await link.save();

    res.json({ original_url, short_url });
  } catch (e) {
    res.json({ error: e.message });
  }
};

exports.getLink = async (req, res) => {
  try {
    const { url } = req.params;

    const link = await Link.findOne({ short_url: Number(url) });
    if (!link) return res.json({ error: 'No short url found for given input' });

    const { original_url } = link;
    res.redirect(original_url);
  } catch (e) {
    res.json({ error: e.message });
  }
};
