import React from 'react';

export class AssetsPage extends React.Component {
  state = {
    
  };
  render() {
    return (
      <div>
        <h2>ASSETS</h2>
        <div>
          <label>How much monedy do you have in bank, and retirement accounts?</label>
          $<input type="text" />
        </div>
        <div>
          <div>
            <input type="checkbox" id="scales" name="homeOwn" checked/>
            <label for="homeOwn">Do You own a home?</label>
          </div>
          <div>
            <label>What is the total value of your home?</label>
            <input disabled="true" type="text" />
          </div>
        </div>
      </div>
    );
  };
}

export default AssetsPage;