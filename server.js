const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const shorturl = require('./routes/shorturl');
const { notFound, errors } = require('./middleware/handleErrors');

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

app.use('/api/shorturl', shorturl);

app.use(notFound);
app.use(errors);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
