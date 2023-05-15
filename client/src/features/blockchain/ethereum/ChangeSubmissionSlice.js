import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {ethers} from 'ethers'
import AC_ABI from '../AccountableChange_abi.json'
import { transformEventsIntoDictionaryArray } from './abi_utilities'

const ETHER_NETWORK = process.env.REACT_APP_ETHEREUM_NETWORK
const CONTRACT_ADDRESS = process.env.REACT_APP_ACCOUNTABLE_CHANGE_CONTRACT_ADDRESS
const EVENT_NAME = "ChangeSubmitted"
const aProvider = new ethers.providers.EtherscanProvider(ETHER_NETWORK, process.env.REACT_APP_ETHERSCAN_KEY);

const initialState = {
    etherScan: null,
    isListening: false,
    isError: false,
    message: ""
}

export const queryFilterWithEtherscan = createAsyncThunk('ChangeSubmission/queryFilterWithEtherscan', async () => {
    try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, AC_ABI, aProvider)
        let currentBlkNum = await aProvider.getBlockNumber();
        const fetchedEvents = await contract.queryFilter(EVENT_NAME, 0, currentBlkNum);
        const anArray = transformEventsIntoDictionaryArray(AC_ABI, EVENT_NAME, fetchedEvents);
        return anArray
    } catch {
        return []
    }
  })
  
export const startListeningToEventOnEtherscan = createAsyncThunk('ChangeSubmission/startListeningToEventOnEtherscan', async (myStore) => {
    try {
        const listeningContract = new ethers.Contract( CONTRACT_ADDRESS, AC_ABI, aProvider);
            listeningContract.on(EVENT_NAME, (sender, data, event) => { 
                myStore.dispatch(addEvent({sender:sender, data:data, event:event}))
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
            console.log("As incoming event shows up, addEvent got called by Dispatcher:" + action.payload)
            state.etherScan.push(action.payload)
          }
    },
    extraReducers(builder) {
        builder.addCase(queryFilterWithEtherscan.fulfilled, (state, action) => {
            state.etherScan = action.payload;
            })
        .addCase(startListeningToEventOnEtherscan.fulfilled, (state, action) => {
            state.isListening = true
            })
    }
    })
    

export const selectEtherScanChangeSubmission = (state) => state.changeSubmissionEvents.etherScan;
export const { addEvent } = changeSubmissionSlice.actions;
export default changeSubmissionSlice.reducer
