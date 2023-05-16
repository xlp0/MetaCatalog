import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { getLanguages } from './features/languages/languageSlice'
import { fetchOriginalProducts } from './features/products/productSlice'
import { fetchInitialEOADictionary } from './features/blockchain/eoaDictionary/eoaDictionarySlice'
import { queryFilterWithChosenProvider, startListeningToEventOnChosenProvider } from './features/blockchain/ethereum/ChangeSubmissionSlice'


store.dispatch(queryFilterWithChosenProvider())
store.dispatch(startListeningToEventOnChosenProvider(store))
store.dispatch(fetchInitialEOADictionary())
store.dispatch(getLanguages())
store.dispatch(fetchOriginalProducts())



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
);
