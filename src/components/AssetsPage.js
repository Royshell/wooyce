import React from 'react';
import { connect } from 'react-redux';
import { addAssetsData } from '../actions/actions';
import PageNavigator from './PageNavigator';

class AssetsPage extends React.Component {
  state = {
    assetsMoney: this.props.assets.assetsMoney || '' ,
    homeOwn: this.props.assets.homeOwn || false,
    homeValue: this.props.assets.homeValue || '',
    carOwn: this.props.assets.carOwn || false,
    carValue: this.props.assets.carValue || ''
  };
  onHomeOwnChange = () => {
    const homeOwn = !this.state.homeOwn;
    this.setState(() => ({ homeOwn }));
  };
  onCarOwnChange = () => {
    const carOwn = !this.state.carOwn;
    this.setState(() => ({ carOwn }));
  };
  onHomeValueChange = (e) => {
    const homeValue = e.target.value;
    this.setState(() => ({ homeValue }));
  };
  onCarValueChange = (e) => {
    const carValue = e.target.value;
    this.setState(() => ({ carValue }));
  };
  onAssetsMoneyChange = (e) => {
    const assetsMoney = e.target.value;
    this.setState(() => ({ assetsMoney }));
  };
  addAssetsData = (e) => {
    console.log(this.state);
    this.props.dispatchThenRoute(this.state);
  };
  render() {
    return (
      <div className="widget">
        <h2 className="widget__title">ASSETS</h2>
        <hr />
        <div className="widget__main">
          <div>
            <label>How much money do you have in bank, and retirement accounts?</label>
            <span className="widget__currency">$</span><input type="text" value={this.state.assetsMoney} onChange={this.onAssetsMoneyChange}/>
          </div>
          <div>
            <div>
              <input type="checkbox" value={this.state.homeOwn} onChange={this.onHomeOwnChange} />
              <label>Do You own a home?</label>
            </div>
            <div>
              <label>What is the total value of your home?</label>
              <input 
                disabled={!this.state.homeOwn} 
                type="text" value={this.state.homeValue} 
                onChange={this.onHomeValueChange}
              />
            </div>
            <div>
            <div>
              <input type="checkbox" value={this.state.carOwn} onChange={this.onCarOwnChange} />
              <label>Do You own a car?</label>
            </div>
            <div>
              <label>What is the total value of your car?</label>
              <input 
                disabled={!this.state.carOwn} 
                type="text" value={this.state.carValue} 
                onChange={this.onCarValueChange}
              />
            </div>
          </div>
          </div>
        </div>
        <PageNavigator prevLink="/income" onNextClick={this.addAssetsData} />
      </div>
    );
  };
}

const mapDispatchToProps = (dispatch, props) => ({
  dispatchThenRoute: (state) => {
   dispatch(addAssetsData(state));
   props.history.push('/debts');
  }
});

const mapStateToProps = (state) => {
  return {
    assets: state.assets
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(AssetsPage);