import React from 'react';
import ReactDOM from 'react-dom';
import './styles/global.css';
import {Provider} from './Context';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
