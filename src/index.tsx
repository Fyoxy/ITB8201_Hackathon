import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MetaMaskProvider } from "@metamask/sdk-react";
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MetaMaskProvider
        sdkOptions={{
          dappMetadata: {
            name: "Läbiepaistev heategevus plokiahela tehnoloogiaga",
            url: window.location.href,
          },
          infuraAPIKey: process.env.REACT_APP_INFURA_API_KEY,
        }}
      >
        <App />
      </MetaMaskProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
