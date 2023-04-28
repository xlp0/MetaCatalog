import React, { useEffect, useState } from 'react'
import { arrayFromStrapiAPI } from '../hooks/useFetch'
import {ethers} from 'ethers'
import SS_ABI from '../features/blockchain/SimpleStore_abi.json'
import CS_ABI from '../features/blockchain/ChangeSuggestion_abi.json'




const Home = () => {

  const [accountList, setAccountList] = useState([])
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState("");
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
  
  useEffect( () => {
    const fetchData = async () => {
      setAccountList(await fetchAccounts());
    };
    fetchData();
  }, [currentContractVal])


  return (
    <div>
      <div><img src="/img/eKatalog_Banner_v5.0.x.jpg" alt="HOME PAGE BANNER" height="300px"></img></div>
      <div className="NAV_WRAPPER">
        <div className="NAV_BOX" title="National Product Showcase">
          <div className="comp-category">
            <img src="/img/k-nasional.svg" alt="National" ></img>
            <h4 className="title-category">National</h4>
          </div>
        </div>
        <div className="NAV_BOX" title="Local Product Showcase">
          <div className="comp-category"><img src="/img/k-lokal.svg" alt="National" ></img>
          <h4 className="title-category">Local</h4>
        </div>
        </div>
        <div className="NAV_BOX" title="Sectoral Product Showcase">
          <div className="comp-category"><img src="/img/k-sektoral.svg" alt="National" ></img>
          <h4 className="title-category">Sectoral</h4>
        </div>
        </div>
        <div className="NAV_BOX" title="SME Product Showcase">
          <div className="comp-category"><img src="/img/k-ukm.svg" alt="National" ></img>
          <h4 className="title-category">UMKK</h4>
        </div>
        </div>
        <div className="NAV_BOX" title="Innovation Product Showcase">
          <div className="comp-category"><img src="/img/k-inovasi.svg" alt="Innovation" ></img>
          <h4 className="title-category">Innovation</h4>
        </div>
        </div>
        <div className="NAV_BOX" title="TKDN">
          <div className="comp-category"><img src="/img/bbi.svg" alt="TKDN" ></img>
          <h4 className="title-category">TKDN</h4>
        </div>
        </div>
      </div>

 
      <div className="LoginPanel">
        <p>Please Login using MetaMask</p>
        <hr />        

        <h3>{'Get/Set Interaction with contract!'}</h3>
        <button onClick={connectWalletHandler}>{connectButtonText}</button>
        <h3>Address:{defaultAccount}</h3>
        <p>{accountList.filter(item => item?.ethereum_address.toLowerCase() === defaultAccount.toLowerCase())[0]?.description}</p>


        <form onSubmit={setHandler}>
            <input id='setText' type='text' />
            <button type='submit'>Update Contract</button>
        </form>
        <button onClick={getCurrentVal} >Get Current Value </button>
        <h3>{currentContractVal}
        {errorMessage}
        </h3>

      </div>
    </div>
  )
}

export default Home


export const fetchAccounts = async ( ) => {

  const res = await arrayFromStrapiAPI('accounts')

  if (null === res){
    throw Error('Could not fetch participant account data...')
  }
  return res
}