const express = require('express');
const router = express.Router();

const validateURL = require('../middleware/validateURL');
const checkStoredURLs = require('../middleware/checkStoredURLs');
const { registerURL, getLink } = require('../controllers/urlController');

router.post('/new', validateURL, checkStoredURLs, registerURL);

router.get('/:url', getLink);

module.exports = router;
