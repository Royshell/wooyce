import React from 'react';
import { connect } from 'react-redux';
import { addPersonalData } from '../actions/actions';
import PageNavigator from './PageNavigator';

export class PersonalInfoPage extends React.Component {
  MIN_AGE = 18;
  MAX_AGE = 83;
  state = {
    age: this.props.personal.age || this.MIN_AGE,
    education: this.props.personal.education || ''
  };
  onAgeChange = (e) => {
    let age = e.target.value;
    if (age > this.MAX_AGE) {
      age = this.MAX_AGE;
    } else if (age < this.MIN_AGE && age > 10) {
      age = this.MIN_AGE;
    } 
    this.setState(() => ({ age }));
  };
  onEducationChange = (e) => {
    const education = e.target.value;
    this.setState(() => ({ education }));
  };
  addPersonalData = (e) => {
    this.props.dispatchThenRoute(this.state);
  };
  render() {
    return (
      <div className="widget">
        <h2 className="widget__title">PERSONAL</h2>
        <hr />
        <div className="widget__main">
          <div>
            <label className="widget--label">How old are you?</label>
            <input type='number' name="age" onChange={this.onAgeChange} min={this.MIN_AGE} max={this.MAX_AGE} value={this.state.age}/>
          </div>
          <div>
            <label className="widget--label">What is your highest level of eduaction?</label> 
            <div>
              <input type="radio" value="highschool" defaultChecked={this.state.education === 'highschool'} onChange={this.onEducationChange}/> High School
            </div>
            <div>
              <input type="radio" value="ba" defaultChecked={this.state.education === 'ba'} onChange={this.onEducationChange}/> Bachelor's Degree
            </div>
            <div>
              <input type="radio" value="ma" defaultChecked={this.state.education === 'ma'}/> Masters Degree
            </div>
            <div>
              <input type="radio" value="phd" defaultChecked={this.state.education === 'phd'} onChange={this.onEducationChange}/> Phd.
            </div>
          </div>
        </div>
        <PageNavigator onNextClick={this.addPersonalData}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    personal: state.personal
  }
};

const mapDispatchToProps = (dispatch, props) => ({
   dispatchThenRoute: (state) => {
    dispatch(addPersonalData(state));
    props.history.push('income');
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInfoPage);