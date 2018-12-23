import React from 'react';
import { connect } from 'react-redux';
import { addIcomeData } from '../actions/actions';
import PageNavigator from './PageNavigator';

class IncomePage extends React.Component {
  state = {
    income: this.props.income.income || '',
    credit: this.props.income.credit || 1
  };
  onIncomeChange = (e) => {
    const income = e.target.value;
    this.setState(() => ({ income }));
  };
  onCreaditChange = (e) => {
    const credit = e.target.value;
    this.setState(() => ({ credit }));
  };
  addIncome = (e) => {
    console.log(this.state);
    this.props.dispatchThenRoute(this.state);
  };
  render() {
    return (
      <div className="widget">
        <h2 className="widget__title">INCOME AND CREDIT</h2>
        <hr />
        <div className="widget__main">
          <div>
            <label className="widget--label">What is your annual pre-tax income? </label>
            <span className="widget__currency">$</span><Cleave options={{numeral: true, numeralThousandsGroupStyle: 'thousand'}} onChange={this.onIncomeChange} value={this.state.income} />
          </div>
          <div>
            <label>What is your credit score</label>
            <select onChange={this.onCreaditChange}>
              <option value="0"></option>
              <option value="1">0-599</option>
              <option value="2">600-699</option>
              <option value="3">700-749</option>
              <option value="4">750-850</option>
            </select>
            <div className="widget__disclaimer">(Leave blank if you don't know your credit score)</div>
          </div>  
        </div>
        <PageNavigator prevLink="/" onNextClick={this.addIncome}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    income: state.income
  }
};

const mapDispatchToProps = (dispatch, props) => ({
  dispatchThenRoute: (state) => {
   dispatch(addIcomeData(state));
   props.history.push('/assets');
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(IncomePage);