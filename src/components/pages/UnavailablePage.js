import React, { Component, Fragment } from 'react';
import Cleave from 'cleave.js/react';
import { withRouter } from 'react-router';

class UnavailablePage extends Component {
  state = {
    emailAddress: '',
    ismailSent: false
  };
  onEmailAddressChange = (e) => {
    const emailAddress = e.target.value;
    this.setState({ emailAddress });
  };
  getEmailAddress = () => {
    //API TO EMAIL ADDRESS GOES HERE

    //If email sent
    this.setState({ ismailSent: true });
  };
  referToPhoneFormPage = () => {
    this.props.history.push('/phone-form');
  };
  render() {
    return (
      <Fragment>
        <div className="widget flexable-widget">
          <div className="widget--logo--wrapper">
            <img src="assets/nosupported.png"></img>        
          </div>
          <div className="widget__title">Unfortunately Elefend doesn't support your phone carrier</div>
          <button onClick={ this.referToPhoneFormPage }>Try a different phone number</button>

      </div>
      <footer className="footer">
        <div className="widget flexable-widget">
          <p className="widget__main-p">We're constantly adding new carriers!</p>
          <p className="widget__medium-p felixable-p">Enter your email address below and we'll let you know as soon as we support your carrier.</p>
           { !this.state.ismailSent && <div className="widget__input-container">
            <Cleave
             placeholder="example@mail.com" 
             onChange={ this.onEmailAddressChange }
            />
            <button className="footer__send-button" onClick={ this.getEmailAddress }><img src="assets/send.png" /></button>
          </div> }
          { this.state.ismailSent && <div className="widget__sent-confirmation">
            Thanks! We'll be in touch soon.
          </div> }
        </div>
      </footer>
     </Fragment>
    );
  };
};

export default withRouter(UnavailablePage);
