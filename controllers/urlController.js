const dns = require('dns');
const { promisify } = require('util');

const Link = require('../models/Link');

exports.registerURL = async (req, res) => {
  const { cleanURL, hostName } = req;
  const lookupPromise = promisify(dns.lookup);

  await lookupPromise(hostName).catch(err => {
    const error = new Error('invalid HostName');
    error.status = 400;
    throw error;
  });
  const count = await Link.countDocuments({});
  const link = new Link({ original_url: cleanURL, short_url: count + 1 });
  const { original_url, short_url } = await link.save();

  res.json({ original_url, short_url });
};

exports.getLink = async (req, res) => {
  const { url } = req.params;

  const link = await Link.findOne({ short_url: Number(url) });
  if (!link) return res.json({ error: 'No short url found for given input' });

  const { original_url } = link;
  res.redirect(original_url);
};
