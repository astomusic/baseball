import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import GlobalStyle from '../styles/global';

import { Home } from './pages';

const App = () => {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
