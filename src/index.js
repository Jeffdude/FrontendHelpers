/*
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
*/

export * from './context';
import JFHApp from './context';
export { JFHApp };

export * from './hooks/auth';
export * from './hooks/data';
export * from './hooks/user';

export * from './constants';
export * from './data';
export * from './date';

/*
ReactDOM.render(
  <React.StrictMode>
    <JFHApp config={{backendURL: "http://192.168.0.204:3600"}}>
      <App />
    </JFHApp>
  </React.StrictMode>,
  document.getElementById('root')
);
*/