require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const parser = require('body-parser');

// Adding a post parser
app.use(parser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let list = [];

const arrayCheck = (val) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i] === val) {
      return true;
    }
  }
}

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  let url = req.body.url;
  let hostname = new URL(url).hostname;

  dns.lookup(hostname, (err, addresses) => {
    if (err) {
      res.json({ error: "invalid url" });
    } else {
      if (arrayCheck(url)) {
        res.json({ original_url: url, short_url: list.indexOf(url) });
      } else {
        list.push(url);
        res.json({ original_url: url, short_url: list.indexOf(url) });
      }
    }
  });
})

app.get('/api/shorturl/:input', function (req, res) {
  input = parseInt(req.params.input);

  if (input < list.length) {
    ori = list[input];
    res.redirect(ori);
  } else {
    res.json({ error: "No short URL found for the given input" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
