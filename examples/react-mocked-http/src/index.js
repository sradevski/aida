import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import configureApp from './config';

configureApp(process.env.NODE_ENV);
ReactDOM.render(<App />, document.getElementById('root'));
