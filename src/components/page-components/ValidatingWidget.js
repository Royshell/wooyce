import React from 'react';

export default function ValidatingWidget({message}) {
  return (
  <div className="validating-widget__blocker">
    <div className="validating-widget__container">
      <div className="validating-widget__spinner-container">
        <img src="assets/spinner.png"></img>
      </div>
      <div>Validating...</div>
    </div>
  </div>
  )
}

// <div className="validating-widget__container">
// <h1 className="validating-widget__title">Validating...</h1>
// <div className="validating-widget__loader"></div>
// <div className="validating-widget__message">{message}</div>
// </div>