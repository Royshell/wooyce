import React, { Component } from 'react';
import { withRouter } from 'react-router';

class PreTutorialPage extends Component {
  state = {
    termsAgreed: false
  };
  onCheckboxClick = (e) => {
    const termsAgreed = e.target.checked;
    this.setState({termsAgreed});
  };
  goToInstallation = () => {
    if (this.state.termsAgreed) {
      this.props.history.push('/tutorial-step-one');
    }
  };
  render() {
    return (
      <div>
        <div className="widget">
          <div className="widget__title">
            <p>The tutotrial will take you step by-step through 3 simple stages to complete the installation.</p>
            <p>(It take less than 2 minutes)</p>
          </div>
        </div>
        <div>
          <input type="checkbox" onClick={this.onCheckboxClick} />
          <label>I understand and agree to Elefend <a>Terms and conditions</a> and <a>Privacy Policy</a></label>
        </div>
        <div className="widget">
          <div className="widget__input-wrapper">
            <button onClick={this.goToInstallation} disabled={!this.state.termsAgreed}>Start Installation</button>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(PreTutorialPage);