import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {ethers} from 'ethers'
import AC_ABI from '../AccountableChange_abi.json'
import { transformEventsIntoDictionaryArray } from './abi_utilities'

const ETHER_NETWORK = process.env.REACT_APP_ETHEREUM_NETWORK
// const alchemyProvider = new ethers.providers.AlchemyProvider(ETHER_NETWORK, process.env.REACT_APP_ALCHEMY_KEY);
const etherScanProvider = new ethers.providers.EtherscanProvider(ETHER_NETWORK, process.env.REACT_APP_ETHERSCAN_KEY);
const CONTRACT_ADDRESS = process.env.REACT_APP_ACCOUNTABLE_CHANGE_CONTRACT_ADDRESS
const EVENT_NAME = "ChangeSubmitted"  

const initialState = {
    changeSubmissionEvents: null,
    latestEvent : null,
    lastBlockNumber: 0,
    dictionaryOfEffectiveChanges: {},
    isListening: false,
    isError: false,
    message: ""
}

export const queryFilterWithChosenProvider = createAsyncThunk('ChangeSubmission/queryFilterWithChosenProvider', async () => {
    try {
        let dictionary = {}

        const contract = new ethers.Contract(CONTRACT_ADDRESS, AC_ABI, etherScanProvider)
        let currentBlkNum = await etherScanProvider.getBlockNumber();
        const fetchedEvents = await contract.queryFilter(EVENT_NAME, 0, currentBlkNum);

        let eventArray = transformEventsIntoDictionaryArray(AC_ABI, EVENT_NAME, fetchedEvents);

        if (Array.isArray(eventArray)){
            eventArray?.forEach((event) => {
                let dataContent = event?.data;
                if (dataContent){
                    dictionary = {...dictionary, ...addToDictionaryOfEffectiveChanges(dataContent)};
                }
              })
        }

        return {changeSubmissionEvents:eventArray, dictionaryOfEffectiveChanges:dictionary}
    } catch (err){
        console.log(err)
        return {}
    }
    })


export const startListeningToEventOnChosenProvider = createAsyncThunk('ChangeSubmission/startListeningToEventOnChosenProvider', async (myStore) => {
    try {
        const listeningContract = new ethers.Contract( CONTRACT_ADDRESS, AC_ABI, etherScanProvider);
        listeningContract.on(EVENT_NAME, (sender, data, event) => { 
            myStore.dispatch(addEvent({sender:sender, data:data, blockNumber: event?.blockNumber}))
            myStore.dispatch(queryFilterWithChosenProvider())
        })
            return null
        } catch {
            return null
        }
    }) 


const addToDictionaryOfEffectiveChanges = ( dataContent ) => {
    let myDictionary = {}
    if (dataContent) {
        try {
            let jsonObj = JSON.parse(dataContent)
            if (jsonObj && jsonObj?.no_produk){
                myDictionary[jsonObj?.no_produk] = Number(jsonObj?.price)
            }
            return myDictionary;
        } catch (err){
            console.log(err)
        }
    }
}    

  //Create the eoaDictionary slice that supplies the data content
const changeSubmissionSlice = createSlice({
    name: 'changeSubmissionEvents',
    initialState,
    reducers: {
        addEvent: (state, action) => {
            state.changeSubmissionEvents.push(action.payload)
            state.lastBlockNumber = action.payload.blockNumber;
            state.latestEvent = action.payload
            state.dictionaryOfEffectiveChanges = {...state.dictionaryOfEffectiveChanges , ...addToDictionaryOfEffectiveChanges(action.payload?.data) }
          }
    },
    extraReducers(builder) {
        builder.addCase(queryFilterWithChosenProvider.fulfilled, (state, action) => {
            state.changeSubmissionEvents = action.payload.changeSubmissionEvents;
            state.dictionaryOfEffectiveChanges = action.payload["dictionaryOfEffectiveChanges"];

            let lastEvent = action.payload.changeSubmissionEvents[action.payload.changeSubmissionEvents.length - 1];
            state.latestEvent = lastEvent
            state.lastBlockNumber = lastEvent.blockNumber;
        })
        .addCase(startListeningToEventOnChosenProvider.fulfilled, (state, action) => {
            state.isListening = true
        })
    }
    })
    

export const selectChangeSubmissionEvents = (state) => state.changeSubmissionEvents.changeSubmissionEvents;
export const selectDictionaryOfEffectiveChanges = (state) => state.changeSubmissionEvents.dictionaryOfEffectiveChanges;

export const { addEvent } = changeSubmissionSlice.actions;
export default changeSubmissionSlice.reducer
