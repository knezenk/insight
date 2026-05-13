import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './app/App';
import { AppProviders } from './app/AppProviders';
import './styles/globals.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root não encontrado no DOM');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
