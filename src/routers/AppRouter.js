import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React from 'react';

import AssetsPage from '../components/AssetsPage';
import DebtsPage from '../components/DebtsPage';
import IncomePage from '../components/IncomePage';
import Nav from '../components/Nav';
import NotFoundPage from '../components/NotFoundPage';
import PageNavigator from '../components/PageNavigator';
import PersonalInfoPage from '../components/PersonalInfoPage';

const AppRouter = () => (
  <BrowserRouter>
    <div className="container">
      <Nav />
      <Switch>
        <Route path="/" component={PersonalInfoPage} exact={true}/>
        <Route path="/income" component={IncomePage} />
        <Route path="/assets" component={AssetsPage} />
        <Route path="/debts" component={DebtsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default AppRouter;
