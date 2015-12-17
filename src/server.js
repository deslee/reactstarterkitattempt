/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel-core/polyfill';
import path from 'path';
//import express from 'express';
import React from 'react';
import fs from 'fs';
import mkdirp from 'mkdirp';
import ReactDOM from 'react-dom/server';
import Router, {routes} from './routes';
import Html from './components/Html';
import globals from './globals'

//const server = global.server = express();

//server.set('port', (process.env.PORT || 5000));
//server.use(express.static(path.join(__dirname, 'public')));

var customRoutes = Router.routes.map(route => {
  return route.path //route.path.slice(globals.publicUrl.length);
}).filter(path => path.length && path.indexOf('*') == -1);

Object.keys(routes).concat(customRoutes).forEach(async route => {

  const data = { title: '', description: '', css: '', body: '' };
  const css = [];
  const context = {
    onInsertCss: value => css.push(value),
    onSetTitle: value => data.title = value,
    onSetMeta: (key, value) => data[key] = value,
    onPageNotFound: () => statusCode = 404
  };

  console.log("dispatching", route);
  await Router.dispatch({ path: route, context }, (state, component) => {
    console.log("dispatched ", route);
    data.body = ReactDOM.renderToString(component);
    data.css = css.join('');
  });

  data.base = globals.publicUrl + '/'

  const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);

  const writePath = path.relative(globals.publicUrl, route)
  const filePath = path.join(__dirname, 'public', writePath, 'index.html');

  console.log("writing to", filePath);

  mkdirp.sync(path.dirname(filePath));
  fs.writeFile(filePath, html);
});

/*

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
server.get('*', async (req, res, next) => {
  try {
    let statusCode = 200;
    const data = { title: '', description: '', css: '', body: '' };
    const css = [];
    const context = {
      onInsertCss: value => css.push(value),
      onSetTitle: value => data.title = value,
      onSetMeta: (key, value) => data[key] = value,
      onPageNotFound: () => statusCode = 404,
    };

    await Router.dispatch({ path: req.path, context }, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(statusCode).send('<!doctype html>\n' + html);
  } catch (err) {
    next(err);
  }
});

//
// Launch the server
// -----------------------------------------------------------------------------

server.listen(server.get('port'), () => {
  /!* eslint-disable no-console *!/
  console.log('The server is running at http://localhost:' + server.get('port'));
  if (process.send) {
    process.send('online');
  }
});
*/
