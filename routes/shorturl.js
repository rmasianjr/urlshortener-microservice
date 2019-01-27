const express = require('express');
const router = express.Router();

const validateURL = require('../middleware/validateURL');
const checkStoredURLs = require('../middleware/checkStoredURLs');
const catchErrors = require('../middleware/catchErrors');
const { registerURL, getLink } = require('../controllers/urlController');

router.post(
  '/new',
  validateURL,
  catchErrors(checkStoredURLs),
  catchErrors(registerURL)
);

router.get('/:url', catchErrors(getLink));

module.exports = router;
