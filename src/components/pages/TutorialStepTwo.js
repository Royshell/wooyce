import React, { Component, Fragment } from 'react';
import SnakeBar from '../page-components/SnakeBar';
import ValidatingWidget from '../page-components/ValidatingWidget';
import { withRouter } from 'react-router';
import {
    checkCallResult,
    getLastCallStatus,
    sendElefendNumberAsSMS, sendForwardingNumberAsSMS,
    verifyElefendContact
} from "../../services/ElefendAPI";

class TutorialStepTwo extends Component {
  state = {
    SMSSent: false,
    isValidating: false,
    contactAddError: false,
    isInfoMessageOpened: false
  };
  sendSMS = () => {
    //API call goes here
    sendElefendNumberAsSMS().then(
        ()=>this.setState({ SMSSent: true }));
  };
  toggleInfoMessage = () => {
    this.setState( { isInfoMessageOpened: !this.state.isInfoMessageOpened });
  };

  addedContact = () => {

      verifyElefendContact().then(() => {
          this.setState({isValidating: true});
          const theClass = this;

          function checkCallStatusOnTimeout() {
              checkCallResult().then(() => {
                  var lastCallStatus = getLastCallStatus()
                  if ("ANSWERED" === lastCallStatus) {
                      sendForwardingNumberAsSMS().then(() => theClass.props.history.push('/tutorial-step-three'));
                  } else if ("HUNGUP" === lastCallStatus || "INIT" !== lastCallStatus) {
                      theClass.setState({ contactAddError: true });
                      theClass.setState({isValidating: false});
                  } else {
                      setTimeout(checkCallStatusOnTimeout, 10000);
                  }
              })
          }

          setTimeout(checkCallStatusOnTimeout, 10000);
      });
  }

  render() {
    return (
      <div>
        <SnakeBar acitveStep={2}/>
        { !this.state.isValidating && !this.state.contactAddError &&  <div className="widget">
          <div className="widget__title">Please add Elefend as a contact to your phone book</div>
          <p>We will send you an SMS with the contact details</p>
          <div className="widget__input-wrapper">
            {!this.state.SMSSent && <button onClick={this.sendSMS}>Send SMS</button>}
            {this.state.SMSSent && <button onClick={this.addedContact}>I added Elefend as a contact to my phone book</button>}
          </div>
        </div>}
        { this.state.isValidating && <ValidatingWidget message='(You will no receive a phone call from Elefend)' /> }
        { this.state.contactAddError && <div className="widget">
            <p>Seems that Elefend was not added to your contact list. Please add it and confirm</p>
            <div className="widget__input-wrapper">
              <button onClick={this.sendSMS}>Send SMS again</button>
            </div>
            <div className="widget__input-wrapper">
              <button onClick={this.addedContact}>I added Elefend as a contact</button>
            </div>
          </div>
        }
        <div className="widget__input-wrapper">
          <button onClick={this.toggleInfoMessage}>Why do I need to perform this step? </button>
        </div> 
        { this.state.isInfoMessageOpened && <div className="widget__inform-message">
          <p>Addin Elefend as a contact to your device's phonebook enables us to call you</p>
            <p>
              <strong>Here's how</strong> <br />
              You will get an SMS with 'Elefend contact. Pless add it to your phone book<br />
            </p>
        </div> }
    </div>
    )
  }
}

export default withRouter(TutorialStepTwo);
