import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import { CometChat } from '@cometchat-pro/chat';

const appID = '{APP_ID}';
CometChat.init(appID)

ReactDOM.render(<App />, document.getElementById('root'));

