import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (!container) {
  console.error("❌ No #root element found!");
} else {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
