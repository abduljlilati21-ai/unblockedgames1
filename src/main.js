import { StrictMode, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    createElement(StrictMode, null, createElement(App, null))
  );
}
