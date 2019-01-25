const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');
const { promisify } = require('util');

const Link = require('./models/Link');

require('dotenv').config();

// connect to database
mongoose.Promise = global.Promise;
mongoose
  .connect(
    process.env.MONGODB_URI,
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

app.post('/api/shorturl/new', (req, res) => {
  const { url } = req.body;
  const lookupPromise = promisify(dns.lookup);
  const pattern = /^(?:https?:\/\/)(?:www\.)([^\/]+)/;

  if (!pattern.test(url)) return res.json({ error: 'invalid URL' });

  const hostName = url.match(pattern)[1];

  function checkHostName() {
    return lookupPromise(hostName).catch(err =>
      Promise.reject(new Error('invalid HostName'))
    );
  }

  checkHostName()
    .then(() => {
      return Link.countDocuments({});
    })
    .then(count => {
      const link = new Link({
        original_url: url,
        short_url: count + 1
      });
      return link.save();
    })
    .then(doc => {
      const { original_url, short_url } = doc;
      res.json({ original_url, short_url });
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
