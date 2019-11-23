import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React from 'react';
import HomePage from '../components/pages/HomePage';
import NotFoundPage from '../components/pages/NotFoundPage';
import AppHeader from '../components/page-components/AppHeader';
import Drawer from '../components/page-components/Drawer';

const AppRouter = () => (
  <BrowserRouter>    
    <div className="container mdl-layout__container">
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <AppHeader/>
        <Drawer/>
        <main className="mdl-layout__content mat-typography">
          <Switch>
            <Route path="/" component={ HomePage } exact={ true }/>
            <Route component={ NotFoundPage } />
          </Switch>
        </main>
      </div>
    </div>
  </BrowserRouter>
);

export default AppRouter;
