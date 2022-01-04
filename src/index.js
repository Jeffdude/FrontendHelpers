import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export * from './context';
import JFHApp from './context';
export { JFHApp };

export * from './components/common';
export * from './components/buttons';
export * from './components/lists';
export * from './components/loading';

export * from './hooks/auth';
export * from './hooks/data';
export * from './hooks/user';

export * from './constants';
export * from './data';
export * from './date';
export * from './object-form';
export * from './result';

ReactDOM.render(
  <React.StrictMode>
    <JFHApp config={{backendURL: "http://192.168.0.88:3600"}}>
      <App />
    </JFHApp>
  </React.StrictMode>,
  document.getElementById('root')
);