import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = () => (
  <div className="navigator">
    <NavLink activeClassName='is-active' className="navigator--a" to='/' exact={true}>1</NavLink>
    <NavLink activeClassName='is-active' className="navigator--a" to='/income'>2</NavLink>
    <NavLink activeClassName='is-active' className="navigator--a" to='/assets'>3</NavLink>
    <NavLink activeClassName='is-active' className="navigator--a" to='/debts'>4</NavLink>
  </div>
);

export default Nav;