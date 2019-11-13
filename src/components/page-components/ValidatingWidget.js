import React from 'react';

export default function ValidatingWidget({message}) {
  return (
  <div className="validating-widget__blocker">
    <div className="validating-widget__container">
      <div className="validating-widget__spinner-container">
        <img className="validating-widget--img" src="assets/spinner.png" />
      </div>
      <div>{ message || 'Validating...' }</div>
    </div>
  </div>
  )
}
