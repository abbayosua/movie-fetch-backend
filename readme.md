# Movie Search Backend with Web Scraping

This backend code is designed to search for movies and extract iframelinks using web scraping. It was written using Node.js, Express, Axios, Cheerio, and EJS. 

## Installation and Setup

1. Clone the repository from GitHub.
2. Install the required dependencies using `npm install`.
3. Create a `.env` file in the root directory and add the following variables:
   * `PORT` - port to run the server on.
   * `TARGET_WEBSITE` - website URL for movie search.
   * `BRIDGE_DOMAIN` - domain for redirecting links to avoid CORS errors.
4. Run the server using `node server.js`.

## Routes

### `/search/:query`

This route searches for movies using the provided query parameter and returns JSON data with movie image, header, and link. The user agent and referer headers are passed in the HTTP GET request.

### `/getiframelinks/:url`

This route extracts iframelinks from the provided URL using the magic potion selector. The decoded link is returned as an EJS rendered view.

### `/`

This route renders an EJS view for searching for movies.

## Creator

- [Abba Yosua](https://github.com/abbayosua) (Creator)
