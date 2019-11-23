import React, { Fragment, Component } from 'react';
import Cleave from 'cleave.js/react';
import { withRouter } from 'react-router';
import {checkVerified, registerPhoneNumber, verifyPhoneNumber} from '../../services/ElefendAPI';
import ValidatingWidget from '../page-components/ValidatingWidget';

let allElements;

class PINCodePage extends Component {
  state = {
    PIN: 'xxxx',
    isChecked: false,
    isValid: undefined,
    isValidating: false
  };


    constructor(props) { ///with babel 7 and the plugins i've added we don't use constructors
        super(props);
        // this.onCleave0Init = this.onCleave0Init.bind(this);
        // this.onCleave1Init = this.onCleave1Init.bind(this);
        // this.onCleave2Init = this.onCleave2Init.bind(this);
        // this.onCleave3Init = this.onCleave3Init.bind(this);
    }

    // onCleave0Init(cleave) {
    //     this.setState({cleave0:cleave});
    // }

    // onCleave1Init(cleave) {
    //     this.setState({cleave1:cleave});
    // }

    // onCleave2Init(cleave) {
    //     this.setState({cleave2:cleave});
    // }

    // onCleave3Init(cleave) {
    //     this.setState({cleave3:cleave});
    // }

  onDigitAdd = async(e) => { //please ident the code

    const currentNode = e.target;
    const digit = currentNode.value;  
    
    allElements = document.querySelectorAll('input');
    const currentIndex = [...allElements].findIndex(el => currentNode.isEqualNode(el)); 

    if (/^\d+$/.test(digit)) {
      let PIN = this.state.PIN;
      PIN = PIN.replaceAt(currentIndex, digit);

      await this.setState({ PIN });

      if (!this.state.isChecked ) {
        if (currentIndex < 3 && !isNaN(digit - parseFloat(digit))) {
          allElements[currentIndex + 1].focus();
        } 
        if (this.state.PIN.length === 4 && !this.state.PIN.includes('x')) {
          this.setState ({ isChecked: true });
          this.checkPIN(this.state.PIN);
          allElements[currentIndex].blur();
        }
      } else if (!this.state.PIN.includes('x')) {
        this.checkPIN(this.state.PIN);
      }
    } 
  };

  checkPinFromButton = ()=> {
    this.checkPIN(this.state.PIN);
  };

  checkPIN = (PINCode) => {
    this.setState({ isValidating: true });
    verifyPhoneNumber(PINCode).then(() => {
      if(checkVerified()) {
        this.setState({isValid: true});
        this.props.history.push('/tutorial-step-one');
      } else {
        this.setState({ isValidating: false });
        this.setState({ isValid: false });
      }
    }).catch(() => {
      this.setState({ isValidating: false });
      this.setState({ isValid: false });
      /* NOTICE - this functionality forwards the client towards unavailable page.
      API should also detect the case where the PIN is inserted but not correct */
    });
  }; 
  resendPIN = async () => {
     /*I've assumed that resgisterPhoneNumber() resend the PIN code it not, please change*/
    this.setState({ isValidating: true });
    [...allElements].map( el => el.value = '');
    await registerPhoneNumber(localStorage.getItem("phonenumber"));
    this.setState({ PIN: 'xxxx' });
    this.setState({ isChecked: false });
    this.setState({ isValidating: false });
  }
  componentDidMount = () =>{
    allElements = document.querySelectorAll('input');
    [...allElements][0].focus();
  };
  render() {
    return (
      <div className="widget">
        <p className="widget__main-p"> Before we get started </p>
        <div className="widget__title widget__mobile-title">Verify your phone number</div>
        <p className="widget__medium-p">Enter the 4-digit code (that we just sent to your phone via text message)</p>
        <div className="widget__digit-input-wrapper">
          <div className="widget__digit-container">
            <input 
              type="text"
              tabIndex="0"
              maxLength="1" 
              className={ 'widget__digit-input ' + (this.state.isChecked && this.state.isValid !== undefined && !this.state.isValid ? 'widget__input-not-valid' : '') } 
              onChange={ this.onDigitAdd }
            />         
          { /*
            <Cleave
              tabIndex="0"
              className={ 'widget__digit-input ' + (this.state.isChecked && this.state.isValid !== undefined && !this.state.isValid ? 'widget__input-not-valid' : '') }
              options={ { numericOnly: true, blocks: [1]} }
              onChange={ this.onDigitAdd }
              //onInit={ this.onCleave0Init }
            />
          */}
          </div>
          <div className="widget__digit-container">
            <input 
              type="text"
              maxLength="1" 
              tabIndex="1"
              className={ 'widget__digit-input ' + (this.state.isChecked && this.state.isValid !== undefined && !this.state.isValid ? 'widget__input-not-valid' : '') } 
              onChange={ this.onDigitAdd }
            />
          </div>
          <div className="widget__digit-container">
            <input 
              type="text"
              maxLength="1" 
              tabIndex="2"
              className={ 'widget__digit-input ' + (this.state.isChecked && this.state.isValid !== undefined && !this.state.isValid ? 'widget__input-not-valid' : '') } 
              onChange={ this.onDigitAdd }
            />
          </div>
          <div className="widget__digit-container">
            <input 
              type="text"
              maxLength="1" 
              tabIndex="3"
              className={ 'widget__digit-input ' + (this.state.isChecked && this.state.isValid !== undefined && !this.state.isValid ? 'widget__input-not-valid' : '') } 
              onChange={ this.onDigitAdd }
            />
          </div>
        </div>
        { this.state.isValid !== undefined && !this.state.isValid && <p className="widget__small-p error">Invalid code, try again</p> }
        <div className="widget__input-wrapper">
          <button onClick={ this.checkPinFromButton }>Verify</button>
        </div>
        <a className="widget--a" onClick={ this.resendPIN }>Resend 4-digit code</a>
        { this.state.isValidating && <ValidatingWidget /> }     
      </div>
    );
  }
}

export default withRouter(PINCodePage);
