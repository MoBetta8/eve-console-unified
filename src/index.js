import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import whyDidYouRender from '@welldone-software/why-did-you-render';

if (process.env.NODE_ENV !== 'production') {
  whyDidYouRender(React);
}

const container = document.getElementById('root');
if (!container) {
  console.error("❌ No #root element found!");
} else {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
