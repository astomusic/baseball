import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import GlobalStyle from '../styles/global';

import { Home, Test } from './pages';

const App = () => {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Switch>
        <Route path="/test" component={Test} />
        <Route path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
