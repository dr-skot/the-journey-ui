import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import LogRocket from 'logrocket';
import './types';
import { isDev } from './the-journey/utils/react-help';

if (!isDev()) LogRocket.init('ophgzh/the-journey');

ReactDOM.render(<App />, document.getElementById('root'));
