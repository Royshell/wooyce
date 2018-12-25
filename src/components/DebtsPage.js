import React from 'react';
import Cleave from 'cleave.js/react';
import { connect } from 'react-redux';
import { addDebtsData } from '../actions/actions';
import PageNavigator from './PageNavigator';

class DebtsPage extends React.Component {
  state = {
    mortgage: '',
    autoLoan: '',
    studentLoan: '',
    creditCardBalance: '',
    other: '',
  };
  onMortgageChange = (e) => {
    const mortgage = e.target.value;
    this.setState(() => ({ mortgage }));
  };
  onAutoLoanChange = (e) => {
    const autoLoan = e.target.value;
    this.setState(() => ({ autoLoan }));
  };
  onStudentLoanChange = (e) => {
    const studentLoan = e.target.value;
    this.setState(() => ({ studentLoan }));
  };
  onCreditCardBalanceChange = (e) => {
    const creditCardBalance = e.target.value;
    this.setState(() => ({ creditCardBalance }));
  };
  onOtherChange = (e) => {
    const other = e.target.value;
    this.setState(() => ({ other }));
  };
  addDebts = () => {
    this.props.dispatchThenRoute(this.state);
  };
  render() {
    return (
      <div className="widget">
        <h2 className="widget__title">DEBTS</h2>
        <hr />
        <h3 className="widget__subtitle">What is the total value of your debts?</h3>
        <div className="widget__main">
          <div>
            <div className="widget__flex-wrapper">
              <label>Mortgage</label>
              <span>
                <span className="widget__currency">$</span><Cleave options={{numeral: true, numeralThousandsGroupStyle: 'thousand'}} value={this.state.mortgage} onChange={this.onMortgageChange}/>
              </span>
            </div>
            <div className="widget__flex-wrapper">
              <label>Auto loan</label>
              <span>
                <span className="widget__currency">$</span><Cleave options={{numeral: true, numeralThousandsGroupStyle: 'thousand'}} value={this.state.autoLoan} onChange={this.onAutoLoanChange}/>
              </span>
            </div>
            <div className="widget__flex-wrapper">
              <label>Student loan</label>
              <span>
                <span className="widget__currency">$</span><Cleave options={{numeral: true, numeralThousandsGroupStyle: 'thousand'}} value={this.state.studentLoan} onChange={this.onStudentLoanChange}/>
              </span>            
            </div>          
          </div>
          <div className="widget__inner-section">
            <div className="widget__flex-wrapper">
              <label>Credit card balance</label>
              <span>
                <span className="widget__currency">$</span><Cleave options={{numeral: true, numeralThousandsGroupStyle: 'thousand'}} value={this.state.creditCardBalance} onChange={this.onCreditCardBalanceChange}/>
              </span>            
              </div>
            <div className="widget__flex-wrapper">
              <label>Other</label>
              <span>
                <span className="widget__currency">$</span><Cleave options={{numeral: true, numeralThousandsGroupStyle: 'thousand'}} value={this.state.other} onChange={this.onOtherChange}/>
              </span>
            </div>
          </div>  
        </div>
        <PageNavigator prevLink="/assets" onNextClick={this.addDebts}/>
      </div>
    );  
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  dispatchThenRoute: (state) => {
   dispatch(addDebtsData(state));
 }
});

export default connect(null, mapDispatchToProps)(DebtsPage);