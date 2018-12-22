import React from 'react';
import { withRouter } from 'react-router'

class PageNavigator extends React.Component {
  onPrevClick = () => {
    this.props.history.push(this.props.prevLink);
  };
  render() {
    return  (
      <div className="page-navigator">
        {this.props.onNextClick && <button onClick={this.props.onNextClick} className="page-navigator--button">Next</button>}
        {this.props.prevLink && <button onClick={this.onPrevClick} className="page-navigator--button">Previous</button>}
      </div>
      );
  }
}

export default withRouter(PageNavigator);