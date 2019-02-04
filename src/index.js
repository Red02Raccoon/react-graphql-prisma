import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'

import * as serviceWorker from './serviceWorker';
import { client } from './config/apolloClient';

import App from './components/App';

import './index.css';

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root'));

serviceWorker.unregister();
