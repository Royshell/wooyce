import React, { Component } from 'react';
import Cleave from 'cleave.js/react';
import ValidatingWidget from '../page-components/ValidatingWidget';

import {
    carrierOk,
    checkCarrier,
    checkLogin,
    checkRegistered,
    login,
    registerPhoneNumber
} from '../../services/ElefendAPI'
import { withRouter } from 'react-router';

class PhoneFormPage extends Component {
  state = {
    phoneNumber: '',
    login_status: 'Trying'
  };
  onLoad = async() => { //I've created this function based on the functions which triggers when the component loads. Verify it works properly
    await login();
    if(checkLogin()) {
        this.setState({login_status:'OK'});
    } else {
        this.setState({login_status:'Failed'})
    }
  };
   onPhoneNumberInputChange = (e) => {
    const phoneNumber = e.target.value;
    this.setState(() => ({ phoneNumber }));
  };
    getPhoneNumber = () => {
        const phoneNumber = this.state.phoneNumber;
        checkCarrier(phoneNumber).then(()=>   //There should be a space before =>
        {
            if(carrierOk())
            {
                registerPhoneNumber(phoneNumber).then(() => { // Please used a fixed convention of Identation
                        if(checkRegistered()) {
                            localStorage.setItem('phonenumber', phoneNumber);
                            this.props.history.push('/pin');
                        }
                    });
            } else {
                this.props.history.push('/unavailable');
            }
        }).catch(reason => {
            console.log("Error:"+reason); // Avoid using " " for strings. Use ' or `
        });
    }

  componentDidMount = async() => {
    await login();
    if(checkLogin()) {
        this.setState({login_status:'OK'});
    } else {
        this.setState({login_status:'Failed'})
    }
  };
    render() {
        if(this.state.login_status=='OK') { // please use === instead of == also, there = should be a space before and after every logical operator. Ident the code
          return (
            <div className="widget">
              <p className="widget__main-p"> Before we get started </p>
              <div className="widget__title widget__mobile-title">Verify your phone number</div>
              <p className="widget__medium-p">We need to verify that Elefend works with your carrier</p>
              <div className="widget__input-wrapper widget__mobile-margin">
                <div className="widget__input-container">
                  <Cleave
                    placeholder="631-204-1535"
                    onChange={ this.onPhoneNumberInputChange }
                  />
                </div>
              </div>   
              <div className="widget__input-wrapper widget__mobile-margin">
                <button onClick={ this.getPhoneNumber} >Verify</button>
              </div> 
              <p className="widget__small-p">By clicking VERIFY, I understand and agree to Elefend's <a className="widget--a"> terms and conditions </a> and <a className="widget--a" > privacy policy </a></p>
            </div>
            )
        }

        if(this.state.login_status=='Trying') {
            return (
              <ValidatingWidget message={ 'Loading...' }/>
            );
        }
        else { 
            return ( 
            <div className="widget">
              <div className="widget__title">Connection to Server Failed</div>
              <div className="widget--logo--wrapper">
                <img className="widget__natural-img" src="assets/img/error.png"></img>        
              </div>
              <div className="widget__input-wrapper">
                <button onClick={ this.onLoad }>Try again</button>
              </div>
            </div>
          )
        }
    }
}

export default withRouter(PhoneFormPage);
