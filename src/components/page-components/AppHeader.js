import React from 'react';

export default function AppHeader() {
  return (
    <header className="mdl-layout__header">
      <div className="mdl-layout__header-row">
        <span className="mdl-layout-title">
          <img className="not-on-mobile" src="/assets/img/bg_logo.png"/>
          <img className="mobile-logo" src="/assets/img/logo.png"/>
        </span>
        <div className="mdl-layout-spacer"></div>
        <nav className="mdl-navigation mdl-layout--large-screen-only">
          <a className="mdl-navigation__link" href="/">How it works</a>
          <a className="mdl-navigation__link" href="/">About</a>
        </nav>
      </div>
    </header>
  )
}

