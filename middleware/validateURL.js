module.exports = (req, res, next) => {
  const { url } = req.body;
  const pattern = /^(?:https?:\/\/)(?:www\.)([^\/\s]+)/;

  if (!pattern.test(url)) return res.json({ error: 'invalid URL' });

  const cleanURL = url.replace(/\s/g, '').trim();
  const hostName = cleanURL.match(pattern)[1];

  //attach to req
  req.cleanURL = cleanURL;
  req.hostName = hostName;
  next();
};
