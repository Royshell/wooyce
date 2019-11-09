import React, { Component, Fragment } from 'react';
import ValidatingWidget from '../page-components/ValidatingWidget';
import { withRouter } from 'react-router';
import {checkCallResult, getLastCallStatus, verifyBlockedNumber} from "../../services/ElefendAPI";

class TutorialStepOneNoiphone extends Component {
  state = {
    isValidating: false,
    isValditaionFailed: false,
  };
  onConfirmSilenceCallers = () => {
    /*API Call goes here */
    verifyBlockedNumber().then(()=>{
      this.setState({ isValidating: true});
      const theClass = this;
      function checkCallStatusOnTimeout() {
          checkCallResult().then(()=>{
          var lastCallStatus =  getLastCallStatus()
          if ("HUNGUP" === lastCallStatus) {
            theClass.props.history.push('/tutorial-step-two');
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
      <div>
        { !this.state.isValditaionFailed && <div className="widget">
            <p className="widget__main-p">Step 1 of 3</p>
            <div className="widget__title">Download the Elefend app</div>
            <p className="widget__medium-p">This app will automatically silence unknown calls.</p>
            <img className="widget__phone-img" src="assets/android.png"/> 
            <p className="widget__medium-p">Go to the Google Play Store on your phone, search for the Elefend Unknown Calls Blocker app, and install it!</p>
            <div className="widget__input-wrapper">
            <button onClick={this.onConfirmSilenceCallers}>I downloaded and installed the app</button>
            </div>
          </div> 
        }
        { this.state.isValidating && <ValidatingWidget /> }
        { this.state.isValditaionFailed &&  <Fragment> 
          <div className="widget__error-msg">
            <img src="assets/x.png" />
            <div>
              <p>Seems that auto blocking of unknown numbers is not working properly, please activate it and if the problem persists contact us</p>
            </div>
          </div>
          <div className="widget__input-wrapper">
            <button onClick={this.onConfirmSilenceCallers}>I downloaded and installed the app</button>
          </div>
        </Fragment>
      }
      </div>
    )
  }
}

export default withRouter(TutorialStepOneNoiphone);