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
          <th> Account with Authority Change </th><th>   Status  </th>
        {tableData.map( (entry) => (
        <tr>
          <td><Link to={`${ETHERSCAN_PREFIX}${entry?.changedAccount}`} target="_blank" rel="noopener noreferrer">{entry?.changedAccount}</Link></td>
          <td>{entry?.data ? "YES" : "NO" }</td>
        </tr>))}
        </table>
      </div>
  </div>
  )
}

export default Announcements