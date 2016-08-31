//SIMple first
import path from 'path';
import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import Grant from 'grant-express';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config.js';
import grantConfig from './config/grant-config.json';

const buildFolder = path.resolve(__dirname, 'src/main/webapp');

const app = express();
//Middleware
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

//Oauth
//app.use(logger('dev'));
let grant = new Grant(grantConfig);
app.use(session({secret: 'grant'}));
app.use(grant);

//Route
app.get('/', function response(req, res) {
  res.write(middleware.fileSystem.readFileSync(`${buildFolder}/index.html`));
  res.end();
});

app.get('/handle_yahoo_callback', function (req, res) {
  console.log(req.query);
  res.redirect('/?oauth_token='+ encodeURIComponent(req.query.access_token) + '&oauth_token_secret=' + encodeURIComponent(req.query.access_secret));
});

app.listen(3000, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', 3000, 3000);
});
