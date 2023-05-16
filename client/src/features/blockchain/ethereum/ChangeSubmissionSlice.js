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
        console.log("Try to PERFORM QUERY anArray:" + JSON.stringify(anArray));

        return anArray
    } catch {
        return []
    }
    })

export const startListeningToEventOnChosenProvider = createAsyncThunk('ChangeSubmission/startListeningToEventOnChosenProvider', async (myStore) => {
    try {
        const listeningContract = new ethers.Contract( CONTRACT_ADDRESS, AC_ABI, etherScanProvider);
        listeningContract.on(EVENT_NAME, (sender, data, event) => { 
            myStore.dispatch(addEvent({sender:sender, data:data, blockNumber: event.blockNumber}))
        })
            return null
        } catch {
            return null
        }
    }) 

  //Create the eoaDictionary slice that supplies the data content
const changeSubmissionSlice = createSlice({
    name: 'changeSubmissionEvents',
    initialState,
    reducers: {
        addEvent: (state, action) => {
            console.log("addEvent triggered:" + JSON.stringify(action.payload));
            state.changeSubmissionEvents.push(action.payload)
          }
    },
    extraReducers(builder) {
        builder.addCase(queryFilterWithChosenProvider.fulfilled, (state, action) => {
            state.changeSubmissionEvents = action.payload;
            })
        .addCase(startListeningToEventOnChosenProvider.fulfilled, (state, action) => {
            console.log("listening event subscribed:" + JSON.stringify(action.payload))
            state.isListening = true
            })
    }
    })
    

export const selectChangeSubmissionEvents = (state) => state.changeSubmissionEvents.changeSubmissionEvents;
export const { addEvent } = changeSubmissionSlice.actions;
export default changeSubmissionSlice.reducer
