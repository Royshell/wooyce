import React, { Component } from 'react';
import Cleave from 'cleave.js/react';
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
        if(this.state.login_status=='OK') { // please use === instead of == also, there also should be a space before and after every logical operator RS
          return (
            <div className="widget">
              <p className="widget__main-p"> Before we get started </p>
              <div className="widget__title">Verify your phone number</div>
              <p className="widget__medium-p">We need to verify that Elefend works with your carrier</p>
              <div className="widget__input-wrapper">
                <div className="widget__input-container">
                  <span className="widget__flag">
                  🇺🇸 +1
                  </span>
                  <Cleave
                    placeholder="631-204-1535"
                    onChange={this.onPhoneNumberInputChange}
                  />
                </div>
              </div>    
              <button onClick={this.getPhoneNumber}>Verify</button>
              <p className="widget__small-p">By clicking VERIFY, I understand and agree to Elefend's <a className="widget--a"> terms and conditions </a> and <a className="widget__a" > privacy policy </a></p>
            </div>
            )
        }

        if(this.state.login_status=='Trying') { // That is not part of the orginal flow. I thought we were using a loader/spinner for that. RS
            return (<div className="widget">
                <div className="widget__title">Connecting To Server</div>
            </div>)
        }
        else {  //This part wasn't part of the orginial. If we need it, it should be designed
            return (<div className="widget"> 
                <div className="widget__title">Connection To Server Failed, Please Try later</div>
                <div className="widget__title">Or Contact Elefend Support</div>
            </div>)

        }
    }
}

export default withRouter(PhoneFormPage);
