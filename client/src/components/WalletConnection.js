import React, { useState } from 'react'
import {ethers} from 'ethers'
import SS_ABI from '../features/blockchain/SimpleStore_abi.json'
import CS_ABI from '../features/blockchain/ChangeSuggestion_abi.json'
import {Link} from 'react-router-dom'



const WalletConnection = () => {

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [connectButtonText, setConnectButtonText] = useState("Connect Wallet");
  const [currentContractVal, setCurrentContractVal] = useState("NONE");

  // const contractAddress = '0x9548fdB78500070aF3C1f1EE421931Cf3857530a'
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;


  const listenToEvent = () => {
    console.log("Listen to Event called...");
    const contract = new ethers.Contract(
                      process.env.REACT_APP_CHANGE_EVENT_CONTRACT_ADDRESS, 
                      CS_ABI, 
                      signer);
                      contract.on("ChangeSuggestionSubmitted", (proposer, data, event) => {
                        let res = {
                          proposer,
                          data,
                          event
                        }
                        console.log(res)
                      })
  }


  const updateEthers = () => {
    const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(contractAddress, SS_ABI, tempSigner);
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
            })
        }catch(err){
            console.log(err);
        }
        
    }else{
        setErrorMessage("Need to install MetaMask!");
    }
    
 }

  const getCurrentVal = async () => {
    const fetchValueFromEthereum = async () => {
      let val = await contract.get();
      console.log("contract fetched value:" + val)
      setCurrentContractVal(val);
    }
    listenToEvent();
    fetchValueFromEthereum();
  }

  const setHandler = (e) => {
    e.preventDefault();

    const fetchValueFromEthereum = async () => {
      contract.set(e.target.setText.value);
      let val = await contract.get();
      console.log("contract fetched value:" + val)
      setCurrentContractVal(val);
    }
    fetchValueFromEthereum();

  }


  return (
    <div>
      <div className="LoginPanel">
        <p>Please Login using MetaMask</p>
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
        

        <form onSubmit={setHandler}>
            <input id='setText' type='text' className="borderedInput" />
            <button type='submit'>Update Contract</button>
        </form>
       <p>---</p>
        <button onClick={getCurrentVal} >Get Current Value </button>
        <h3>{currentContractVal}
        {errorMessage}
        </h3>:

      </div>
    </div>
  )
}

export default WalletConnection