import React, { Component } from 'react';
import SnakeBar from '../page-components/SnakeBar';
import { withRouter } from 'react-router';

class TutorialStepOne extends Component {
  state = {
    isInfoMessageOpened: false
  };
  toggleInfoMessage = () => {
    this.setState( { isInfoMessageOpened: !this.state.isInfoMessageOpened });
  };
  goToIphonePage = () => {
    this.props.history.push('/tutorial-step-one-iphone');
  };
  goToNoIphonePage = () => {
    this.props.history.push('/tutorial-step-one-noiphone');
  };
  render() {
    return (
      <div>
        <div className="widget">
          <p className="widget__main-p">Step 1 of 3</p>
          <div className="widget__title">Silence unknown callers</div>
          <p className="widget__medium-p">This is so Elefend knows which calls to analyze, and can then monitor and direct these calls back to you.</p>
          <p className="widget__small-p">Don't worry! You can easily deactivate this in the future.</p>
          <p className="widget__medium-p">What type of phone do you have?</p>
          <div className="widget_input-wrapper">
            <div className="widget_os-block">
            </div>
            <div className="widget_os-block">
            </div>
          </div>
          <div className="widget_input-wrapper">
            <button onClick={this.goToIphonePage}>Yes</button>  <button onClick={this.goToNoIphonePage}>No</button>
          </div>
          <div className="widget_input-wrapper">
            <button>Next</button>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(TutorialStepOne);