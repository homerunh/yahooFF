//SIMple first
import path from 'path';
import express from 'express';
//import morgan as logger from 'morgan';
//import session from 'express-session';
//import Grant from 'grant-express';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config.js';

const buildFolder = path.resolve(__dirname, 'src/main/webapp');

const app = express();

const compiler = webpack(config);
const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false,
  },
});

app.use(express.static(buildFolder));
app.use(middleware);
app.use(webpackHotMiddleware(compiler));

app.get('/', function response(req, res) {
  res.write(middleware.fileSystem.readFileSync(`${buildFolder}/index.html`));
  res.end();
});

app.listen(3000, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', 3000, 3000);
}); 


//Grant
/**

var Grant = require('grant-express');
var grant = new Grant(require('./config.json'));

var app = express();
app.use(logger('dev'));
// REQUIRED:
app.use(session({secret: 'very secret'}));
// mount grant
app.use(grant);

app.get('/handle_facebook_callback', function (req, res) {
  console.log(req.query);
  res.end(JSON.stringify(req.query, null, 2));
});

app.get('/handle_twitter_callback', function (req, res) {
  console.log(req.query);
  res.end(JSON.stringify(req.query, null, 2));
});

app.listen(3000, function () {
  console.log('Express server listening on port ' + 3000);
});

 */