import ReactDOM from 'react-dom/client';
import React from 'react';
import Home from './Home';
require("@solana/wallet-adapter-react-ui/styles.css");

const root = ReactDOM.createRoot(document.getElementById('root') as Element | DocumentFragment);
root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
);
