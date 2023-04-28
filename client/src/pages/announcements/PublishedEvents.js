import {ethers} from 'ethers'
import CS_ABI from '../../features/blockchain/ChangeSuggestion_abi.json'
import { useEffect, useState } from 'react';

const PublishedEvents = () => {

  const eventName = "ChangeSuggestionSubmitted"
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

    const contract = await new ethers.Contract(process.env.REACT_APP_CHANGE_EVENT_CONTRACT_ADDRESS, CS_ABI, aProvider)

    const fetchedEvents = await contract.queryFilter(eventName, 0, currentBlkNum);
    setEvents(fetchedEvents)
  }

  const queryFilterWithAlchemy = async () => {
    const aProvider = new ethers.providers.AlchemyProvider("goerli", process.env.REACT_APP_ALCHEMY_KEY);
    setProvider(aProvider);
    setProviderName("Alchemy:" + aProvider.connection.url);

    let currentBlkNum = await aProvider.getBlockNumber();
    console.log("Current Block Number" + currentBlkNum);

    const contract = await new ethers.Contract(process.env.REACT_APP_CHANGE_EVENT_CONTRACT_ADDRESS, CS_ABI, aProvider)

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

    const contract = await new ethers.Contract(process.env.REACT_APP_CHANGE_EVENT_CONTRACT_ADDRESS, CS_ABI, aProvider)

    const fetchedEvents = await contract.queryFilter(eventName, 0, currentBlkNum);
    setEvents(fetchedEvents)
  }

  useEffect(() => {
    const fetchData = async () => {
      const rows = await Promise.all(
        events.map(async (event) => {
          const proposer =  event.args.proposer;
          const data =  event.args.data;
          return { proposer, data };
        })
      );
      setTableData(rows);
    };
    fetchData()
    console.log("Selected Provider: " + JSON.stringify(provider))
  }, [provider, providerName, events])

  return (
    <div>
    <div>PublishedEvents</div>
      <div>
        <button onClick={queryFilterWithInfura}>Query Event - Infura Provider </button>
        <button onClick={queryFilterWithAlchemy}>Query Filter - Alchemy</button>
        <button onClick={queryFilterWithEtherscan}>Query Filter - Etherscan</button>
      </div>
      <div className="container">
        <p>Event List Table</p>
        <p>From {providerName}</p>
        <table>
          <th>proposer</th><th>data</th>
        {tableData.map( (e) => (
        <tr>
          <td>{e?.proposer}</td>
          <td>{e?.data}</td>
        </tr>))}
        </table>
      </div>
  </div>
  )
}

export default PublishedEvents