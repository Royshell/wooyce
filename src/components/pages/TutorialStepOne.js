import React, { Component } from 'react';
import { withRouter } from 'react-router';

class TutorialStepOne extends Component {
  state = {
    isIphone: 'unset'
  };
  isIphoneSelected = (isIphone) => {
    this.setState({ isIphone });
  };
  referToPage = () => {
    this.state.isIphone ? this.props.history.push('/tutorial-step-one-iphone') : this.props.history.push('/tutorial-step-one-noiphone');
  };
  render() {
    return (
      <div>
        <div className="widget flexable-widget">
          <p className="widget__main-p">Step 1 of 3</p>
          <div className="widget__title">Silence unknown callers</div>
          <p className="widget__medium-p">This is so Elefend knows which calls to analyze, and can then monitor and direct these calls back to you.</p>
          <p className="widget__small-p">Don't worry! You can easily deactivate this in the future.</p>
          <p className="widget__medium-p">What type of phone do you have?</p>
          <div className="widget__icons-wrapper">
            <div className="widget_os-block"  onClick={ () => this.isIphoneSelected(true) }>
              <img className="widget__natural-img" src="assets/apple-icon.png"/>
              <div className="widget_os-block-title">iPhone</div>
              <input checked={ this.state.isIphone && this.state.isIphone !== 'unset' }  type="radio"  readOnly />
            </div>
            <div className="widget_os-block" onClick={ () => this.isIphoneSelected(false) }>
              <img className="widget__natural-img" src="assets/android-icon.png"/>
              <div className="widget_os-block-title">Android</div>
              <input checked={ !this.state.isIphone && this.state.isIphone !== 'unset' } type="radio" readOnly/>
            </div>
          </div>
          <div className="widget_input-wrapper">
            <button disabled={ this.state.isIphone === 'unset' } onClick={ this.referToPage }>Next</button>
          </div>
        </div>
      </div>
    );
  };
};

export default withRouter(TutorialStepOne);