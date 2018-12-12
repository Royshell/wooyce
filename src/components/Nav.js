import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => (
  <div>
    <Link to='/'>1</Link>
    <Link to='/income'>2</Link>
    <Link to='/assets'>3</Link>
    <Link to='/debts'>4</Link>
  </div>
);

export default Nav;