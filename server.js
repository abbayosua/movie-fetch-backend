require('dotenv').config()
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const ejs = require('ejs');

const app = express();
const port = process.env.PORT;

app.set("view engine", "ejs");

const movieDomain = process.env.TARGET_WEBSITE
const bridgeDomain = process.env.BRIDGE_DOMAIN

app.get('/search/:query', (req, res) => {
  const url = `${movieDomain}/?s=${req.params.query}`; // extract the URL from the query parameter

  // set the headers to be passed with the HTTP GET request
  const headers = {
    'User-Agent': req.query.useragent,
    'Referer': movieDomain
  };

  const config = {
    headers: headers
  };

  axios.get(url, config)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      const results = [];
      $('div.col-xs-3.col-sm-2.search-poster figure').each((i, el) => {
        const figure = $(el);
        const img = `https:${figure.find('img').attr('src')}`;
        const header = figure.find('a').attr('title');
        const link = figure.find('a').attr('href');
        results.push({ img, header, link });
      });

      res.json(results);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Error scraping the webpage');
    });
});


app.get('/getiframelinks/:url', (req, res) => {
  const url = req.params.url
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    'Accept-Language': 'en-US,en;q=0.9',
  };
  const selector = 'ul.list-unstyled.dropdown-menu.dropdown-menu-right'; // this is the magic potion here

  axios.get(url, { headers })
    .then(response => {
      const $ = cheerio.load(response.data)
      const links = [];

      $(selector).find('a').each((i, el) => {
        const link = $(el).attr('href');
        const parsedLink = decodeURIComponent(link.replace(bridgeDomain, ''))
        links.push(parsedLink);
      });
      // res.json({ links }); // return the extracted link as a JSON response
      res.render('watch', { links });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while scraping the webpage' });
    });
});

app.get("/", function(req, res) {
  res.render("search")
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});