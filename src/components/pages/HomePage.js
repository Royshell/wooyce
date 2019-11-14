import React, { Component } from 'react';
import { withRouter } from 'react-router';

class HomePage extends Component {
  goToApp = () => {
    this.props.history.push('/phone-form');
  };
  render() {
    return (
      <div className="widget">
        <div className="widget--logo--wrapper">
          <img src="assets/img/logo.png"></img>        
        </div>
        <div>
          <div className="widget__title">Get started with Elefend (Beta)</div>
          <p className="widget__main-p">Elefend identifies scams by monitoring and analyzing calls from { <br/> } unknown callers and alerting you if there's a risk while you're { <br/> }   on the call</p>
        </div>
        <button onClick={this.goToApp}>Let's Start</button>
      </div>
    );
  };
};

export default withRouter(HomePage);
