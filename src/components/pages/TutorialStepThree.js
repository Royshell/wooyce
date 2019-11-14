import React, { Component, Fragment } from 'react';
import ValidatingWidget from '../page-components/ValidatingWidget';
import {
    checkForwarding, 
    checkForwardingResult,
    getCallForwardingNumber,
    verifyCallForwarding
} from '../../services/ElefendAPI'

export default class TutorialStepThree extends Component {
  state = {
    isValidating: false,
    isConfirmed: false,
    isFailed: false,
    isInfoMessageOpened: false,
    PIN: getCallForwardingNumber() //API Doesn't suplly access to PIN
  };
  sendConfirmationSMS = () => {
    //API request goes here
  };
  toggleInfoMessage = () => {
    this.setState( { isInfoMessageOpened: !this.state.isInfoMessageOpened });
  };
  onCallConfirm = () => {
      verifyCallForwarding().then(()=> {
          this.setState({isValidating: true});
          const theClass = this; //once again, use arrow functions RS

          function checkCallStatusOnTimeout() {
              checkForwardingResult().then(() => {
                  var lastFwdStatus = checkForwarding() //again - use const and add a ';'
                  if ("SUCCESS" === lastFwdStatus) {
                      theClass.setState({isConfirmed:true})
                  } else if ("FAILED" === lastFwdStatus || "INIT" !== lastFwdStatus) {
                      theClass.setState({isFailed: true});
                      theClass.setState({isValidating: false});
                  } else {
                      setTimeout(checkCallStatusOnTimeout, 10000);
                  }
              })
          }
          setTimeout(checkCallStatusOnTimeout, 10000);
      })
  };
  render() {
    return (
      <Fragment>
        { !this.state.isConfirmed && !this.state.isFailed && <div className="widget flexable-widget">
          <p className="widget__main-p">Step 3 of 3</p>
          <div className="widget__title">Activate call forward of silenced calls</div>
          <p className="widget__medium-p">This allows Elefend to receive, monitor, and forward back to you any silenced calls from unknown numbers.</p>
          <p className="widget__medium-p">We just sent you text message with the following number</p>
          <img className="widget__natural-img" src="assets/img/dial.svg" />
          <div className="widget__asterisk-number">
            *67*13221*11#
          </div>
          <p className="widget__medium-p">Call this number on your phone</p>
          <div className="widget__input-wrapper">
            <button onClick={ this.onCallConfirm }>I called the above number</button>
          </div>
        </div> }
        { this.state.isValidating && <ValidatingWidget/> }
        { this.state.isConfirmed && <Fragment>
            <div className="widget">
              <img className="widget__natural-img" src="assets/img/success.png" />
            </div>
            <div className="widget">
              <div className="widget__title">Thank you for joining Elefend Beta!</div>
              <div className="widget__input-wrapper">
              <button><a href="mailto:info@elefend.com">Contact us for feedback</a></button>
            </div>
          
            <p className="widget__medium-p">You can deactivate Elefend at any time</p>
            <a className="widget--a">Learn how </a>
          </div>
        </Fragment> }
       </Fragment>
    );
  }
}
