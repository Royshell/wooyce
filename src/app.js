import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'normalize.css/normalize.css';
import AppRouter from './routers/AppRouter';

console.log('bahh bahh');

const jsx = (
  <AppRouter />
);
ReactDOM.render(jsx, document.getElementById('app'));
