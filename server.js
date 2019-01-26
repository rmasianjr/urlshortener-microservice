const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');
const { promisify } = require('util');

const Link = require('./models/Link');
const validateURL = require('./middleware/validateURL');
const checkStoredURLs = require('./middleware/checkStoredURLs');

require('dotenv').config();

// connect to database
mongoose.Promise = global.Promise;
mongoose
  .connect(
    process.env.MONGODB_TEST,
    { useNewUrlParser: true }
  )
  .catch(err => console.log(`Error: ${err.message}`));

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/api/shorturl/new', validateURL, checkStoredURLs, (req, res) => {
  const { cleanURL, hostName } = req;
  const lookupPromise = promisify(dns.lookup);

  function checkHostName(host) {
    return lookupPromise(host).catch(err => {
      throw new Error('invalid HostName');
    });
  }

  checkHostName(hostName)
    .then(() => {
      return Link.countDocuments({});
    })
    .then(count => {
      const link = new Link({ original_url: cleanURL, short_url: count + 1 });
      return link.save();
    })
    .then(doc => {
      const { original_url, short_url } = doc;
      res.json({ original_url, short_url });
    })
    .catch(err => res.json({ error: err.message }));
});

app.get('/api/shorturl/:url', (req, res) => {
  const { url } = req.params;

  Link.findOne({ short_url: Number(url) })
    .then(doc => {
      if (doc) {
        const { original_url } = doc;
        res.redirect(original_url);
      } else {
        throw new Error('No short url found for given input');
      }
    })
    .catch(err => res.json({ error: err.message }));
});

app.use((req, res) => {
  res.status(404);
  res.json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  res.status(500);
  res.json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
