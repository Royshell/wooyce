import React, { Fragment, Component } from 'react';
import Cleave from 'cleave.js/react';
import { withRouter } from 'react-router';
import {checkVerified, registerPhoneNumber, verifyPhoneNumber} from '../../services/ElefendAPI';

class PINCodePage extends Component {
  state = {
    PIN: '',
    isChecked: false,
    isValid: false,
  };


    constructor(props) { ///with babel 7 and the plugins i've added we don't use constructors
        super(props);
        this.onCleave0Init = this.onCleave0Init.bind(this);
        this.onCleave1Init = this.onCleave1Init.bind(this);
        this.onCleave2Init = this.onCleave2Init.bind(this);
        this.onCleave3Init = this.onCleave3Init.bind(this);
    }

    onCleave0Init(cleave) {
        this.setState({cleave0:cleave});
    }

    onCleave1Init(cleave) {
        this.setState({cleave1:cleave});
    }

    onCleave2Init(cleave) {
        this.setState({cleave2:cleave});
    }

    onCleave3Init(cleave) {
        this.setState({cleave3:cleave});
    }

    onDigitAdd = async(e) => { //please ident the code
    const currentNode = e.target;
    const digit = currentNode.value;  
    await this.setState({ PIN: this.state.PIN + digit});
    const allElements = document.querySelectorAll('input');
    const currentIndex = [...allElements].findIndex(el => currentNode.isEqualNode(el)); 

    if (currentIndex < 3 && !isNaN(digit - parseFloat(digit))) {
      allElements[currentIndex + 1].focus();
    } 
    if (this.state.PIN.length === 4) {
      this.checkPIN(this.state.PIN);
    }
  };

  checkPinFromButton = ()=> {
      this.checkPIN(this.state.PIN);
  };

  checkPIN = (PINCode) => {
    verifyPhoneNumber(PINCode).then(() => {
      if(checkVerified()) {
        this.setState({isChecked: true});
        this.setState({PIN: ''});
        this.setState({isValid: true});
        this.props.history.push('/tutorial-step-one');
      } else {
          const allElements = document.querySelectorAll('input');
          console.log("Last element:"+allElements[3].value);
          [...allElements].map(el => el.value = '');
          allElements[0].focus();
          this.setState({PIN: ''});
          this.state.cleave0.setRawValue("")
          this.state.cleave1.setRawValue("")
          this.state.cleave2.setRawValue("")
          this.state.cleave3.setRawValue("")
      }
    }).catch(() => {
      const allElements = document.querySelectorAll('input');
      [...allElements].map(el => el.value = '');
      allElements[0].focus();
      this.props.history.push('/unavailable');
      
      /* NOTICE - this functionality forwards the client towards unavailable page.
      API should also detect the case where the PIN is inserted but not correct */
    });
  }; 
  resendPIN = async () => {
     /*I've assumed that resgisterPhoneNumber() resend the PIN code it not, please change*/
    await registerPhoneNumber(localStorage.getItem("phonenumber"));
  }
  render() {
    return (
      <div className="widget">
        <p className="widget__main-p"> Before we get started </p>
        <div className="widget__title widget__mobile-title">Verify your phone number</div>
        <p className="widget__medium-p">Enter the 4-digit code (that we just sent to your phone via text message)</p>
        <div className="widget__digit-input-wrapper">
          <div className="widget__digit-container">
            <Cleave
              tabindex="0"
              className={ 'widget__digit-input ' + (this.state.isChecked && this.state.isValid ? 'widget__input-valid' : '') }
              options={ { numericOnly: true, blocks: [1]} }
              onChange={ this.onDigitAdd }
              onInit={ this.onCleave0Init }
            />
          </div>
          <div className="widget__digit-container">
            <Cleave
              tabindex="1"
              className={ 'widget__digit-input ' + (this.state.isChecked && this.state.isValid ? 'widget__input-valid' : '') }
              options={ {numericOnly: true, blocks: [1]} }
              onChange={ this.onDigitAdd }
              onInit={ this.onCleave1Init }
            />
          </div>
          <div className="widget__digit-container">
            <Cleave
              tabindex="2"
              className={ 'widget__digit-input ' + (this.state.isChecked && this.state.isValid ? 'widget__input-valid' : '') }
              options={ {numericOnly: true, blocks: [1]} }
              onChange={ this.onDigitAdd }
              onInit={ this.onCleave2Init }
            />
          </div>
          <div className="widget__digit-container">
            <Cleave
              tabindex="3"
              className={ 'widget__digit-input ' + (this.state.isChecked && this.state.isValid ? 'widget__input-valid' : '') }
              options={ {numericOnly: true, blocks: [1]} }
              onChange={ this.onDigitAdd }
              onInit={ this.onCleave3Init }
            />
          </div>
        </div>
        { !this.state.isChecked && !this.state.isValid && 
        <Fragment>
          <button onClick={ this.checkPinFromButton }>Verify</button>
        </Fragment> 
        }
      </div>
    );
  }
}

export default withRouter(PINCodePage);
