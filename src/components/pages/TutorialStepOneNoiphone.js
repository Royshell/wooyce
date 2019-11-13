import React, { Component, Fragment } from 'react';
import ValidatingWidget from '../page-components/ValidatingWidget';
import { withRouter } from 'react-router';
import {checkCallResult, getLastCallStatus, verifyBlockedNumber} from "../../services/ElefendAPI";

class TutorialStepOneNoiphone extends Component {
  state = {
    isValditaionFailed: true,
    isValidating: false,
  };
  onConfirmDownload = () => {
    /*API Call goes here */
    verifyBlockedNumber().then(()=>{
      this.setState({ isValidating: true});
      const theClass = this; // no need when using arrow functions RS
      function checkCallStatusOnTimeout() { //old syntax. please use arrow functions RS
        checkCallResult().then(()=>{
          var lastCallStatus =  getLastCallStatus() // please use 'const' instead of var and add ; RS
          if ("HUNGUP" === lastCallStatus) {
            theClass.props.history.push('/tutorial-step-two-noiphone');
          } else if ("ANSWERED" === lastCallStatus || "INIT" !== lastCallStatus)
          {
            theClass.setState({isValditaionFailed: true});
            theClass.setState({isValidating: false}); 
          } else {
            setTimeout(checkCallStatusOnTimeout,10000);
          }
        })
      }

      setTimeout(checkCallStatusOnTimeout,10000);
    });
  }
  render() {
    return (
      <div className="widget">
        <p className="widget__main-p">Step 1 of 3</p>
        <div className="widget__title"> { !this.state.isValditaionFailed ? 'Download the Elefend app' : 'Silence unknown callers' }</div>
        { !this.state.isValditaionFailed && <Fragment>
          <p className="widget__medium-p">This app will automatically silence unknown calls.</p>
          <img className="widget__natural-img" src="assets/android-app.png"/> 
          <p className="widget__medium-p">Go to the Google Play Store on your phone, search for the Elefend Unknown Calls Blocker app, and install it!</p>
          <div className="widget__input-wrapper">
            <button onClick={ this.onConfirmDownload }>I downloaded and installed the app</button>
          </div>
        </Fragment>}
        { this.state.isValditaionFailed &&  <Fragment>
          <img src={'assets/error.png'} /> 
          <p className="widget__medium-p">Unknown callers are not properly blocked on your phone</p>
          <p className="widget__small-p">If you’re sure that unknown callers are blocked on your phone, confirm below I confirm that unknown numbers are blocked on my phone</p>
          <a className="widget--a" onClick={ this.onConfirmDownload }>I confirm that I added Elefend as a contact</a>
          <div className="widget__input-wrapper">
            <button onClick={ this.onConfirmDownload }>Try again</button>
          </div> 
          <a className="widget--a" onClick={ this.onConfirmDownload }>I confirm that I added Elefend as a contact</a>
        </Fragment> }
        { this.state.isValidating && <ValidatingWidget /> }
      </div>
    );
  };
};

export default withRouter(TutorialStepOneNoiphone);
