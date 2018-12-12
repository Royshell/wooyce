import React from 'react';

const DebtsPage = () => (
  <div>
    <h2>DEBTS</h2>
    <div>
      <h3>What is the total value of your debts?</h3>
      <div>
        <label>Mortgage</label>
        $<input type="text"/>
        <label>Auto loan</label>
        $<input type="text"/>
        <label>Student loan </label>
        $<input type="text"/>
      </div>
      <div>
        <label>Credit card balance</label>
        $<input type="text" />
        <label>Other</label>
        $<input type="text" />
      </div>  
    </div>
  </div>
);

export default DebtsPage;