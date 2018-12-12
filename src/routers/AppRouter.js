import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React from 'react';
import PersonalInfoPage from '../components/PersonalInfoPage';
import IncomePage from '../components/IncomePage';
import AssetsPage from '../components/AssetsPage';
import DebtsPage from '../components/DebtsPage';
import Nav from '../components/Nav';
import NotFoundPage from '../components/NotFoundPage';

PersonalInfoPage 
const AppRouter = () => (
  <BrowserRouter>
    <div>
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
