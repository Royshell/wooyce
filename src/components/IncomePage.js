import React from 'react';

const IncomePage = () => (
  <div>
    <h2>INCOME AND CREDIT</h2>
    <div>
      <label>What is your annual pre-tax income? </label>
      $<input type="text" />
    </div>
    <div>
      <label for="creditScore">What is your credit score</label>
      <input type="text"  name="creditScore" />
    </div>  
  </div>
);

export default IncomePage;