import React, { useState, useEffect } from 'react'
import {ethers} from 'ethers'
import AC_ABI from '../features/blockchain/AccountableChange_abi.json'
import { useSelector } from "react-redux";

import { selectedItem } from '../features/items/itemSlice'
import EtherscanLink from './EtherscanLink'

import { priceString } from '../hooks/formatters'


const WalletConnection = () => {

  const ETHER_NETWORK = process.env.REACT_APP_ETHEREUM_NETWORK;
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [connectButtonText, setConnectButtonText] = useState("Connect Wallet");
  const WIP_INDICATOR_STRING = "Waiting for value from the blockchain ..."
  const [currentContractVal, setCurrentContractVal] = useState(WIP_INDICATOR_STRING);

  const contractAddress = process.env.REACT_APP_ACCOUNTABLE_CHANGE_CONTRACT_ADDRESS;
  const EVENT_NAME = "ChangeSubmitted"
  const WALLET_CONNECTED_TEXT = "Wallet Connected"

  const [value, setValue] = useState('');
  const [valueSubmissionFailed, setValueSubmissionFailed] = useState(false);
  const [submissionFailureText, setSubmissionFailureText] = useState("");


  const theSelectedItem = useSelector(selectedItem);

  const handleChange = (event) => {
    const regex = /^[1-9]\d*$/; // positive integer regex
    const inputValue = event.target.value;

    if (regex.test(inputValue) || inputValue === '') {
      setValue(inputValue);
    }
  };


  const listenToEvent = () => {
    console.log("Listen to Event called...");
    setIsLoading(true)
    try {
    const listeningContract = new ethers.Contract(
                      contractAddress, 
                      AC_ABI,
                      provider);
    listeningContract.on(EVENT_NAME, (eventOutput) => {
      let res = {
        eventOutput
      }
      setIsLoading(false)
      fetchValueFromEthereum()
    })
  } catch (err) {
    console.log(err)

  }
  }


  const updateEthers = () => {
    const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(contractAddress, AC_ABI, tempSigner);
    setContract(tempContract);
 }

  const accountChangeHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
 }


  const connectWalletHandler = () => {
    console.log("Connecting to Wallet now...")
    if (window.ethereum){
        try {
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then( result => {
            accountChangeHandler(result[0]);
            setConnectButtonText(WALLET_CONNECTED_TEXT);
            listenToEvent()
            })
        }catch(err){
            console.log("connectWalletHandler failed first time:" + err);
        }
        
    }else{
        setErrorMessage("Need to install MetaMask!");
    }
    
 }

  const fetchValueFromEthereum = async () => {
    setCurrentContractVal(WIP_INDICATOR_STRING);
    let currentBlkNum = await provider.getBlockNumber();
    const fetchedEvents = await contract.queryFilter(EVENT_NAME, 0, currentBlkNum);
    const latestEvent = fetchedEvents.pop();
    let val = latestEvent.args.sender + ":" + latestEvent.args.data;
    setCurrentContractVal(val);
    return val;
  }

  const submitValueToContract = async (e) => {
    e.preventDefault();
    try {
      const valueToBeSent = { no_produk:theSelectedItem?.no_produk, price: value}
      let strValue = JSON.stringify(valueToBeSent)

      await contract.submitChange(strValue);  
      e.target.setText.value = '';
      setIsLoading(true);
      fetchValueFromEthereum();
      setValueSubmissionFailed(false)
      setSubmissionFailureText("")
    } catch (err){
      setValueSubmissionFailed(true)
      setSubmissionFailureText("Failed to submit value, this account is not allowed to submit price change, please change the selected MetaMask Account...")
      console.log("submitValueToContract Failed:" + err);
    }
  }

    useEffect(() => {
        // console.log("useEffect called:" + currentContractVal)
    }, [currentContractVal, isLoading])

    useEffect(() => {
      console.log("useEffect called:" + submissionFailureText)
  }, [submissionFailureText])

    const contractValueComponent = () => {
      let aStr =  currentContractVal
      try {
      const firstColonIndex = aStr.indexOf(':');
      const part1 = aStr.substring(0, firstColonIndex);
      const part2 = aStr.substring(firstColonIndex + 1);
      
        try {
          let jsonObj = JSON.parse(part2)
          
          if ('price' in jsonObj){
            let price = Number(jsonObj["price"])
            return <section>
                      <p> Updated Price: {priceString(price)}</p> 
                      <p>Changed by: {part1}</p>
                    </section>
          }
        } catch (err) {
          console.log(err + ": accountStr")
        }
      
    }catch (error) {
      console.log(error)
    }
      return aStr;
    }

  return (
    <div>
      <div className="LoginPanel">
        {WALLET_CONNECTED_TEXT === connectButtonText ? "" : <p>You will need to have MetaMask installed in your browser to use this panel</p> }
       
        <hr />        

        <button onClick={connectWalletHandler}>{connectButtonText}</button>
        
        
        {defaultAccount ?
          <h3>
            Ethereum Address: 
            <EtherscanLink network={ETHER_NETWORK} assetType="address" address={defaultAccount}/>
          </h3>:

          <div> No connected account, yet </div>
        }
        
        
        {defaultAccount ? (
  <div>
    <h3>
      <p>---</p>
      <hr />
      Solidity Contract Address:{" "}
      <EtherscanLink network={ETHER_NETWORK} assetType="address" address={contractAddress}/>
    </h3>

    <form onSubmit={submitValueToContract}>
      <h3>New Price:</h3>
      <input className="borderedInput" id="setText" value={value} onChange={handleChange} type="text" placeholder="Type content to be send to the contract" />
      <button type="submit">Submit Change Request</button>
    </form>
    
    {valueSubmissionFailed? <p style={{ color: 'red' }}>{submissionFailureText}</p> : <p>{submissionFailureText}</p> }

    <p>--- Updated Contract Value ---</p>
    <h3>
      {isLoading ? (
        
        <div>{WIP_INDICATOR_STRING}</div>
      ) : (
        <div style={{ fontSize: "15px", color: "red" }}>{contractValueComponent()}</div>
      )}
      {errorMessage}
    </h3>
  </div>
) : (
  ""
)}

      
      </div>
    </div>
  )
}

export default WalletConnection