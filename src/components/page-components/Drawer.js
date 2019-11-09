import React from 'react';

export default function Drawer() {
  return (
    <div className="mdl-layout__drawer">
      <span className="mdl-layout-title">Elefend</span>
      <nav className="mdl-navigation">
        <a className="mdl-navigation__link" href="/">How it works</a>
        <a className="mdl-navigation__link" href="/">About</a>
      </nav>
    </div>
  )
}

