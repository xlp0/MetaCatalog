import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {createSelector} from 'reselect';

const defaultDict = {"0x372C68C90f433C54c4AE06b4Ddf107ce8baB67Cc": "LKPP"};

const initialState = {
    accountAliases: defaultDict ? defaultDict :null
  }

//Register the initial Externally Owned Account Dictionary
export const fetchInitialEOADictionary = createAsyncThunk('eoaDictionary/fetchInitialEOADictionary', async () => {
    try {
      // Fetch data from URL
      const response = await fetch(`/EOA_Dictionary.json`)
      const theDictionary = await response.json()
      return theDictionary;
    } catch (err) {
      console.error(err)
    }
    return null
  })
  
//Create the eoaDictionary slice that supplies the data content
const eoaDictionarySlice = createSlice({
name: 'accountAliases',
initialState,
reducers: {},
extraReducers(builder) {
    builder.addCase(fetchInitialEOADictionary.fulfilled, (state, action) => {
        state.accountAliases = action.payload;
    })
}
})

export const selectAccountAliases = (state) => state.eoaDictionary.accountAliases;

export const nameLookupSelector = createSelector(
    selectAccountAliases,
    (accountAliases) => (key) => {
      if (accountAliases && accountAliases[key]) {
        return accountAliases[key];
      }
      return key;
    }
  );

export const nameLookup = (key) => nameLookupSelector(key);


export default eoaDictionarySlice.reducer