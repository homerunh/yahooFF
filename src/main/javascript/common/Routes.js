import React from 'react';
import { Route } from 'react-router';

import App from 'FF/components/App';
import About from 'FF/components/About';

export default (
  <Route path="/" component={App}>
    <Route path="/about" component={About}/>
  </Route>
);