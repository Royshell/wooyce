import React, { Component, Fragment } from 'react';
import SnakeBar from '../page-components/SnakeBar';
import ValidatingWidget from '../page-components/ValidatingWidget';
import {
    checkCallResult, checkForwarding, checkForwardingResult,
    getCallForwardingNumber,
    getLastCallStatus,
    verifyBlockedNumber, verifyCallForwarding
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
          const theClass = this;

          function checkCallStatusOnTimeout() {
              checkForwardingResult().then(() => {
                  var lastFwdStatus = checkForwarding()
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
      <div>
        <SnakeBar acitveStep={3}/>
        { !this.state.isValidating && !this.state.isConfirmed && !this.state.isFailed && <div className="widget">
          <div className="widget__title">We sent you an SMS with the following code</div>
          <p>{this.state.PIN}</p>
          <p>Please copy and paste the code in your phone's dialer, press SEND and wait for confirmation</p>
          <div className="widget__input-wrapper">
            <button onClick={this.onCallConfirm}>I Confirm Conditional Call Forwarding is activated</button>
          </div>
        </div> }
        { !this.state.isValidating && !this.state.isConfirmed && !this.state.isFailed && <div className="widget__input-wrapper">
          <button onClick={this.toggleInfoMessage}>Why do I need to perform this step? </button>
        </div> }
        { this.state.isInfoMessageOpened && <div className="widget__inform-message">
          <p>Once the unknown calls are blocked, activating the 'Conditinal Call Forwarding'</p>
          <p>
            <strong>Here's how</strong> <br />
            You will get an SMS with a 'code' to be copied and pasted in your dialer<br />
            You will then get a confirmation notification
          </p>
        </div> }
        { this.state.isValidating && !this.state.isConfirmed && !this.state.isFailed && <ValidatingWidget/> }
        { this.state.isConfirmed && <Fragment>
            <div className="widget">
              <img className="widget__green-star" src='assets/gray-border-star.svg' />
            </div>
            <div className="widget">
            <div className="widget__title">Thank you for joining Elefend Beta!</div>
            <p>Please send us your feedback to <a href="mailto:info@elefend.com">info@elefend.com</a></p>
          </div>
      </Fragment> }
      { this.state.isFailed &&  <Fragment> 
        <div className="widget__error-msg">
          <img src="assets/x.png" />
          <div>
            <p>Call routing is not working properly, please try solve it with your carrier and try again. If the problem persists contact us.</p>
          </div>
        </div>
        <div className="widget__input-wrapper">
          <button onClick={this.onCallConfirm}>I Confirm Conditional Call Forwarding is activated</button>
        </div>
      </Fragment> }
      </div>
    )
  }
}
