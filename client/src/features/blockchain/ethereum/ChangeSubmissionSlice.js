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
        const contract = new ethers.Contract(CONTRACT_ADDRESS, AC_ABI, etherScanProvider)
        let currentBlkNum = await etherScanProvider.getBlockNumber();
        const fetchedEvents = await contract.queryFilter(EVENT_NAME, 0, currentBlkNum);
        const anArray = transformEventsIntoDictionaryArray(AC_ABI, EVENT_NAME, fetchedEvents);

        return anArray
    } catch {
        return []
    }
    })

export const buildDictionaryOfEffectiveChanges = createAsyncThunk('ChangeSubmission/buildDictionaryOfEffectiveChanges', async () => {
    try {
        let dictionary = {}
        const contract = new ethers.Contract(CONTRACT_ADDRESS, AC_ABI, etherScanProvider)
        let currentBlkNum = await etherScanProvider.getBlockNumber();
        const fetchedEvents = await contract.queryFilter(EVENT_NAME, 0, currentBlkNum);
        
        let eventArray = transformEventsIntoDictionaryArray(AC_ABI, EVENT_NAME, fetchedEvents);
        if (Array.isArray(eventArray)){
            eventArray?.forEach((event) => {
                console.log("event content" + JSON.stringify(event));
                let dataContent = event?.data;
                if (dataContent){
                    console.log("data content" + dataContent);
                    dictionary = {...dictionary, ...sendDataContentToDictionaryOfEffectiveChanges(dataContent)};
                }
                console.log("dictionary content" + JSON.stringify(dictionary));

              })
        }

        return dictionary
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


const sendDataContentToDictionaryOfEffectiveChanges = ( dataContent ) => {
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
            state.dictionaryOfEffectiveChanges = {...state.dictionaryOfEffectiveChanges , ...sendDataContentToDictionaryOfEffectiveChanges(action.payload?.data) }
          }
    },
    extraReducers(builder) {
        builder.addCase(queryFilterWithChosenProvider.fulfilled, (state, action) => {
            state.changeSubmissionEvents = action.payload;
            let lastEvent = action.payload[action.payload.length - 1];
            state.latestEvent = lastEvent
            state.lastBlockNumber = lastEvent.blockNumber;
        })
        .addCase(startListeningToEventOnChosenProvider.fulfilled, (state, action) => {
            state.isListening = true
        })
        .addCase(buildDictionaryOfEffectiveChanges.fulfilled, (state, action) => {
            state.dictionaryOfEffectiveChanges = {...state.dictionaryOfEffectiveChanges , ...action.payload }
        })
    }
    })
    

export const selectChangeSubmissionEvents = (state) => state.changeSubmissionEvents.changeSubmissionEvents;
export const selectDictionaryOfEffectiveChanges = (state) => state.changeSubmissionEvents.dictionaryOfEffectiveChanges;

export const { addEvent } = changeSubmissionSlice.actions;
export default changeSubmissionSlice.reducer
