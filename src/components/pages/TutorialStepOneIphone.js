import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import { checkCallResult, getLastCallStatus, verifyBlockedNumber } from "../../services/ElefendAPI";
import ValidatingWidget from '../page-components/ValidatingWidget';

class TutorialStepOneIphone extends Component {
  state = {
    currentStage: 1,
    isValditaionFailed: false,
    isValidating: false,
  };
  onNextStage = () => {
   
    if (this.state.currentStage < 4) {
      this.setState({ currentStage: this.state.currentStage + 1 })
    } else {
      this.onConfirmSilenceCallers();
    }
  };
  getStageText = (currentStage) => {
    let text; 

    switch(currentStage) {
      case 1:
        text = '1. Click Settings on your phone';
        break;
      case 2:
        text = '2. Scroll down and tap Phone';
        break;
      case 3:
        text = '3. Scroll down to the section Called Silencing and Blocked Contacts';
        break;
      case 4:
        text = '4. Tap the Silence Unknown Callers to turn it on'; 
      break;       
      default:
        text = '';
      break;  
    }

    return text;
  };
  onConfirmSilenceCallers = () => {
    /*API Call goes here */
    verifyBlockedNumber().then(()=>{
      this.setState({ isValidating: true});
      const theClass = this; // no need when using arrow functions RS
      function checkCallStatusOnTimeout() { //old syntax. please use arrow functions RS
        checkCallResult().then(()=>{
          var lastCallStatus =  getLastCallStatus() // please use 'const' instead of var and add ; RS
          if ("HUNGUP" === lastCallStatus) {
            theClass.props.history.push('/tutorial-step-two-iphone');
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
        <div className="widget__title">Silence unknown callers</div>
        { !this.state.isValditaionFailed &&  <div className="widget__medium-p">This is so Elefend knows which calls to analyze, and can then monitor and forward these calls back to you.</div> }
        { this.state.isValditaionFailed &&  <Fragment>
          <img src={'assets/error.png'} /> 
          <p className="widget__medium-p">Unknown callers are not properly blocked on your phone</p>
          <p className="widget__small-p">If you’re sure that unknown callers are blocked on your phone, confirm below I confirm that unknown numbers are blocked on my phone</p>
          <a className="widget--a" onClick={ this.onConfirmSilenceCallers }>I confirm that I added Elefend as a contact</a>
        </Fragment> }
        { !this.state.isValditaionFailed && <Fragment>
          { <hr/> }
          <p className="widget__main-p">{ this.getStageText(this.state.currentStage) }</p>
          <img className="widget__natural-img" src={ `assets/iphone${this.state.currentStage}.png` } /> 
        </Fragment> }
        <div className="widget__input-wrapper">
          <button onClick={ this.onNextStage }>{ this.state.isValditaionFailed ? 'Try again' : 'Next' }</button>
        </div>    
        {
          this.state.isValditaionFailed && <a className="widget--a" onClick={ this.onConfirmSilenceCallers }>I confirm that I added Elefend as a contact</a>
        }  
        { this.state.isValidating && <ValidatingWidget /> }     
      </div>
    );
  };
};

export default withRouter(TutorialStepOneIphone);
