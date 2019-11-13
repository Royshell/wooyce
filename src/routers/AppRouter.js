import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React from 'react';
import HomePage from '../components/pages/HomePage';
import NotFoundPage from '../components/pages/NotFoundPage';
import PhoneFormPage from '../components/pages/PhoneFormPage';
import PINCodePage from '../components/pages/PINCodePage';
import UnavailablePage from '../components/pages/UnavailablePage';
import TutorialStepOne from '../components/pages/TutorialStepOne';
import TutorialStepTwoNoiphone from '../components/pages/TutorialStepTwoNoiphone';
import TutorialStepThree from '../components/pages/TutorialStepThree';
import TutorialStepOneIphone from '../components/pages/TutorialStepOneIphone';
import TutorialStepOneNoiphone from '../components/pages/TutorialStepOneNoiphone';
import AppHeader from '../components/page-components/AppHeader';
import Drawer from '../components/page-components/Drawer'
import TutorialStepTwoIphone from '../components/pages/TutorialStepTwoIphone';

const AppRouter = () => (
  <BrowserRouter>    
    <div className="container mdl-layout__container">
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <AppHeader/>
        <Drawer/>
        <main className="mdl-layout__content mat-typography">
          <Switch>
            <Route path="/" component={ HomePage } exact={ true }/>
            <Route path="/phone-form" component={ PhoneFormPage }/>
            <Route path="/unavailable" component={ UnavailablePage } />
            <Route path="/pin" component={ PINCodePage } />
            <Route path="/tutorial-step-one" component={ TutorialStepOne } />
            <Route path="/tutorial-step-one-iphone" component={ TutorialStepOneIphone } />
            <Route path="/tutorial-step-one-noiphone" component={ TutorialStepOneNoiphone } />            
            <Route path="/tutorial-step-two-iphone" component={ TutorialStepTwoIphone } />
            <Route path="/tutorial-step-two-noiphone" component={ TutorialStepTwoNoiphone } />
            <Route path="/tutorial-step-three" component={ TutorialStepThree } />
            <Route component={ NotFoundPage } />
          </Switch>
        </main>
      </div>
    </div>
  </BrowserRouter>
);

export default AppRouter;
