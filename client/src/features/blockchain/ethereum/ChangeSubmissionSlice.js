import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {ethers} from 'ethers'
import AC_ABI from '../AccountableChange_abi.json'
import { transformEventsIntoDictionaryArray } from './abi_utilities'

const ETHER_NETWORK = process.env.REACT_APP_ETHEREUM_NETWORK
const CONTRACT_ADDRESS = process.env.REACT_APP_ACCOUNTABLE_CHANGE_CONTRACT_ADDRESS
const EVENT_NAME = "ChangeSubmitted"

const initialState = {
    etherScan: null
}

export const queryFilterWithEtherscan = createAsyncThunk('ChangeSubmission/queryFilterWithEtherscan', async () => {
    try {
        const aProvider = new ethers.providers.EtherscanProvider(ETHER_NETWORK, process.env.REACT_APP_ETHERSCAN_KEY);
        let currentBlkNum = await aProvider.getBlockNumber();
        const contract = await new ethers.Contract(CONTRACT_ADDRESS, AC_ABI, aProvider)

        const fetchedEvents = await contract.queryFilter(EVENT_NAME, 0, currentBlkNum);
        
        const anArray = transformEventsIntoDictionaryArray(AC_ABI, EVENT_NAME, fetchedEvents);
        
        return anArray
    } catch {
        return []
    }
  })

  //Create the eoaDictionary slice that supplies the data content
const changeSubmissionSlice = createSlice({
    name: 'changeSubmissionEvents',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(queryFilterWithEtherscan.fulfilled, (state, action) => {
            console.log("extraReducer stage:" +  JSON.stringify(action.payload))
            state.etherScan = action.payload;
        })
    }
    })
    

export const selectEtherScanChangeSubmission = (state) => state.changeSubmissionEvents.etherScan;

export default changeSubmissionSlice.reducer
