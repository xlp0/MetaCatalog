import React, { useState, useEffect } from 'react'
import {ethers} from 'ethers'
import AC_ABI from '../features/blockchain/AccountableChange_abi.json'
import {Link} from 'react-router-dom'

const WalletConnection = () => {

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
  const eventName = "ChangeSubmitted"


  const listenToEvent = () => {
    console.log("Listen to Event called...");
    setIsLoading(true)
    const listeningContract = new ethers.Contract(
                      contractAddress, 
                      AC_ABI, 
                      signer);
                      listeningContract.on(eventName, (eventOutput) => {
                        let res = {
                          eventOutput
                        }
                        setIsLoading(false)
                        fetchValueFromEthereum()
                        console.log("DATA FROM EVENT:" + JSON.stringify(res))
                      })
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
            setConnectButtonText("Wallet Connected");
            updateCurrentValue();
            })
        }catch(err){
            console.log(err);
        }
        
    }else{
        setErrorMessage("Need to install MetaMask!");
    }
    
 }

  const updateCurrentValue = async () => {
    listenToEvent();
  }

  const fetchValueFromEthereum = async () => {
    setCurrentContractVal(WIP_INDICATOR_STRING);
    let currentBlkNum = await provider.getBlockNumber();
    const fetchedEvents = await contract.queryFilter(eventName, 0, currentBlkNum);
    const latestEvent = fetchedEvents.pop();
    let val = latestEvent.args.sender + ":" + latestEvent.args.data;
    console.log("fecthValueFromEthereum called:" + val)
    setCurrentContractVal(val);
    return val;
  }

  const submitValueToContract = (e) => {
    e.preventDefault();
    contract.submitChange(e.target.setText.value);  
    e.target.setText.value = '';
    setIsLoading(true);
    fetchValueFromEthereum();
  }

    useEffect(() => {
        console.log("useEffect called:" + currentContractVal)
    }, [currentContractVal, isLoading])

  return (
    <div>
      <div className="LoginPanel">
        <p>You will need to have MetaMask installed in your browser to use this panel</p>
        <hr />        

        <h3>{'Get/Set Interaction with contract!'}</h3>
        <button onClick={connectWalletHandler}>{connectButtonText}</button>
        

        {defaultAccount ?
          <h3>
            Ethereum Address: 
            <Link to={`https://goerli.etherscan.io/address/${defaultAccount}`} target="_blank" rel="noopener noreferrer">
            {defaultAccount}
            </Link>
          </h3>:

          <div> No connected account, yet </div>
        }
        
        
        <h3>
        <p>---</p>
            <hr/>
            Solidity Contract Address: 
            <Link to={`https://goerli.etherscan.io/address/${contractAddress}`} target="_blank" rel="noopener noreferrer">
            {contractAddress}
            </Link>
          </h3>

        <form onSubmit={submitValueToContract}>
            <input className="borderedInput" id='setText' type='text' placeholder="Type content to be send to the contract"  />
            <button type='submit'>Update Contract</button>
        </form>
       <p>--- Updated Contract Value ---</p>
        {/* <button onClick={getCurrentVal} > Get Current Value </button> */}
        <h3>{isLoading ? <div>{WIP_INDICATOR_STRING}</div> : <div>{currentContractVal}</div>}
        {errorMessage}
        </h3>:

      </div>
    </div>
  )
}

export default WalletConnection