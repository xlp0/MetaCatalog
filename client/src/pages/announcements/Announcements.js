import {ethers} from 'ethers'
// import CS_ABI from '../../features/blockchain/ChangeSuggestion_abi.json'
// import SS_ABI from '../../features/blockchain/SimpleStore_abi.json'
import AC_ABI from '../../features/blockchain/AccountableChange_abi.json'
import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'

const Announcements = () => {
  
  const ETHERSCAN_PREFIX = "https://goerli.etherscan.io/address/"
  const CONTRACT_ADDRESS = process.env.REACT_APP_ACCOUNTABLE_CHANGE_CONTRACT_ADDRESS
  const eventName = "AuthorizationChanged"
  
  const [provider, setProvider] = useState(null);
  const [events, setEvents] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [providerName, setProviderName] = useState("No Provider")

  const accountDictionary = {
    "0x372C68C90f433C54c4AE06b4Ddf107ce8baB67Cc": "LKPP",
    "0xF1E4cc03796c2d37d502CC484E3b67fB9Bf4E479": "Vendor 001",
    "0x1c117Eb98169f2a81A17e18C07bD5ca44ee56411": "Finance Department",
    "0xDd83c5776c274e78bD55Db135AA43210e838F5c8": "Transportation Department",
  }

  function nameLookup( str) {
    if (accountDictionary[str]){
      return accountDictionary[str]
    }
    return str
  }

  function shortenedAccountString( str ) {
    if (str.length < 20){
      return str
    }else{
      let firstPart = str.slice(0,10)
      let lastPart = str.slice(-10)
      return firstPart+ "..." + lastPart
    }
  }

  const queryFilterWithInfura = async () => {
    const aProvider = new ethers.providers.InfuraProvider("goerli", process.env.REACT_APP_INFURA_PROJECT_ID);
    setProvider(aProvider);
    setProviderName("Infura:" + aProvider.connection.url);

    let currentBlkNum = await aProvider.getBlockNumber();
    console.log("Current Block Number" + currentBlkNum);

    const contract = await new ethers.Contract(CONTRACT_ADDRESS, AC_ABI, aProvider)

    const fetchedEvents = await contract.queryFilter(eventName, 0, currentBlkNum);
    setEvents(fetchedEvents)
  }

  const queryFilterWithAlchemy = async () => {
    const aProvider = new ethers.providers.AlchemyProvider("goerli", process.env.REACT_APP_ALCHEMY_KEY);
    setProvider(aProvider);
    setProviderName("Alchemy:" + aProvider.connection.url);

    let currentBlkNum = await aProvider.getBlockNumber();
    console.log("Current Block Number" + currentBlkNum);

    const contract = await new ethers.Contract(CONTRACT_ADDRESS, AC_ABI, aProvider)

    const fetchedEvents = await contract.queryFilter(eventName, 0, currentBlkNum);
    setEvents(fetchedEvents)
  }

  const queryFilterWithEtherscan = async () => {
    const aProvider = new ethers.providers.EtherscanProvider("goerli", process.env.REACT_APP_ETHERSCAN_KEY);
    setProvider(aProvider);
    setProviderName("Etherscan:" + aProvider.getBaseUrl());

    const url =  aProvider.getBaseUrl()
    console.log("Use Etherscan Provider URL:" + JSON.stringify(url));
    let currentBlkNum = await aProvider.getBlockNumber();
    console.log("Current Block Number" + currentBlkNum);

    const contract = await new ethers.Contract(CONTRACT_ADDRESS, AC_ABI, aProvider)

    const fetchedEvents = await contract.queryFilter(eventName, 0, currentBlkNum);
    const oneEvent = fetchedEvents[0];
    console.log("blockTimestamp:" + oneEvent.blockTimestamp)
    setEvents(fetchedEvents.reverse())
  }

  useEffect(() => {
    const fetchData = async () => {
      const rows = await Promise.all(
        events.map(async (event) => {
          const changedAccount =  event.args.account;
          const data =  event.args.authorized;
          return { changedAccount, data };
        })
      );
      setTableData(rows);
    };
    fetchData()
    console.log("Selected Provider: " + JSON.stringify(provider))
  }, [provider, providerName, events])

  return (
    <div>
    <div>Announcements</div>
      <div className="providerList">
        <button onClick={queryFilterWithInfura}>Infura</button>
        <button onClick={queryFilterWithAlchemy}>Alchemy</button>
        <button onClick={queryFilterWithEtherscan}>Etherscan</button>
      </div>
      <div className="container">
        <p>Event List Table</p>
        <p>From {providerName}</p>
        <table>
          <th> Account with Authority Change </th><th>   Agency represented by the Account   </th><th>   Status  </th>
        {tableData.map( (entry) => (
        <tr>
          <td><Link to={`${ETHERSCAN_PREFIX}${entry?.changedAccount}`} target="_blank" rel="noopener noreferrer">{shortenedAccountString(entry?.changedAccount)}</Link></td>
          <td>{shortenedAccountString(nameLookup(entry?.changedAccount))}</td>
          <td>{entry?.data ? "YES" : "NO" }</td>
        </tr>))}
        </table>
      </div>
  </div>
  )
}

export default Announcements