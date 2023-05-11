import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import {getLanguages} from './features/languages/languageSlice'
import {fetchOriginalProducts} from './features/products/productSlice'
import {fetchInitialEOADictionary} from './features/blockchain/eoaDictionary/eoaDictionarySlice'


store.dispatch(getLanguages())
store.dispatch(fetchOriginalProducts())
store.dispatch(fetchInitialEOADictionary())


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
);
