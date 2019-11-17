import React, { Component, Fragment } from 'react';
import ValidatingWidget from '../page-components/ValidatingWidget';
import { withRouter } from 'react-router';
import {
  checkCallResult,
  getLastCallStatus,
  sendElefendNumberAsSMS, sendForwardingNumberAsSMS,
  verifyElefendContact
} from "../../services/ElefendAPI";

class TutorialStepTwoNoIphone extends Component {
  state = {
    currentStage: 1,
    isValidating: false,
    isValditaionFailed: false,
  };  
  onConfirmElefendAdded = () => {
    this.props.history.push('/tutorial-step-three');
  };
  onSendTextAgain = () => {
    this.sendSMS();
  };
  getStageText = (currentStage, element) => {
    let text; 

    if (element !== 'button') {
      switch(currentStage) {
        case 1:
          text = 'We\'ll send a text message to your phone with Elefend\'s contact details.';
          break;
        case 2:
          text = 'We\'ve just sent you a text message with Elefend\'s contact details. Now add Elefend as a contact on your phone and continue.';
          break;
        case 3:
          text = 'You will now receive a phone call from Elefend Security. Answer the call to receive the confirmation.';
          break;     
        default:
          text = '';
        break;  
      }
  } else {
    switch(currentStage) {
      case 1:
        text = 'Send text message';
        break;
      case 2:
        text = 'I added Elefend as a contact';
        break;
      case 3:
        text = 'I answered the call';
        break;     
      default:
        text = '';
      break;  
    }
  }

    return text;
  };
  onNextStage = async() => {

    if (this.state.currentStage < 3) {
      if ( this.state.currentStage === 1) { // on step 1 we send an sms message. please verify this logic works
        try {
          await this.sendSMS();
        } catch(error) {
          console.log(error);
        }     
      } else if (this.state.currentStage === 2){
        this.addedContact();
      }
      this.setState({ currentStage: this.state.currentStage + 1 })
    } else {
      this.props.history.push('/tutorial-step-three');
    }
  };
  sendSMS = () => {  // please ident and refactor the code according to mu guidance in previous files
    //API call goes here
    sendElefendNumberAsSMS().then(
        ()=>this.setState({ SMSSent: true }));
  };
  addedContact = () => { // please ident and refactor the code according to mu guidance in previous files

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
  ;}
  render() {
    return (
      <div className="widget">
        <p className="widget__main-p">Step 2 of 3</p>
        <div className="widget__title widget__mobile-title">Add Elefend contact to your phone</div>
        { !this.state.isValditaionFailed && <p className="widget__medium-p">{ this.getStageText(this.state.currentStage) }</p> }
        { this.state.isValditaionFailed &&  <Fragment>
          <img className="widget__natural-img" src={'assets/img/error.png'} /> 
          <p className="widget__main-p noto-font">Elefend has not been added as a contact to your phone.</p>
          <p className="widget__small-p">If you are sure that you added Elefend as a contact, confirm below</p>
          <a className="widget--a" onClick={ this.onConfirmElefendAdded }>I confirm I added Elefend as a contact</a>
        </Fragment> }
        { !this.state.isValditaionFailed && <Fragment>
          <img className="widget__natural-img" src={ `assets/img/android-2-${this.state.currentStage}.png` } /> 
          <div className="widget__input-wrapper">
            <button onClick={ this.onNextStage }>{ this.getStageText(this.state.currentStage, 'button') }</button>
          </div>    
        </Fragment> }
        { this.state.isValditaionFailed && <Fragment>
          <div className="widget__input-wrapper">
            <button onClick={ this.onSendTextAgain }>Send text again</button>
          </div>  
        </Fragment> }
        { this.state.isValditaionFailed && <a className="widget--a" href="mailto:info@elefend.com">Contact our customer support team for help</a> }  
        { this.state.isValidating && <ValidatingWidget /> }     
      </div>
    );
  }
}

export default withRouter(TutorialStepTwoNoIphone);
