import {ethers} from 'ethers'

// import CS_ABI from '../../features/blockchain/ChangeSuggestion_abi.json'
// import SS_ABI from '../../features/blockchain/SimpleStore_abi.json'
import AC_ABI from '../../features/blockchain/AccountableChange_abi.json'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { nameLookup } from '../../features/blockchain/eoaDictionary/eoaDictionarySlice'
import EtherscanLink from '../../components/EtherscanLink';


const PublishedEvents = () => {
  
  const ETHER_NETWORK = process.env.REACT_APP_ETHEREUM_NETWORK
  const CONTRACT_ADDRESS = process.env.REACT_APP_ACCOUNTABLE_CHANGE_CONTRACT_ADDRESS
  const EVENT_NAME = "ChangeSubmitted"

  const [provider, setProvider] = useState(null);
  const [events, setEvents] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [providerName, setProviderName] = useState("No Provider")

  const lookupFunction =  useSelector(nameLookup);

  const queryFilterWithInfura = async () => {
    const aProvider = new ethers.providers.InfuraProvider(ETHER_NETWORK, process.env.REACT_APP_INFURA_PROJECT_ID);
    setProvider(aProvider);
    setProviderName("Infura:" + aProvider.connection.url);

    let currentBlkNum = await aProvider.getBlockNumber();

    const contract = await new ethers.Contract(CONTRACT_ADDRESS, AC_ABI, aProvider)

    const fetchedEvents = await contract.queryFilter(EVENT_NAME, 0, currentBlkNum);
    setEvents(fetchedEvents)
  }

  const queryFilterWithAlchemy = async () => {
    const aProvider = new ethers.providers.AlchemyProvider(ETHER_NETWORK, process.env.REACT_APP_ALCHEMY_KEY);
    setProvider(aProvider);
    setProviderName("Alchemy:" + aProvider.connection.url);

    let currentBlkNum = await aProvider.getBlockNumber();
    console.log("Current Block Number" + currentBlkNum);

    const contract = await new ethers.Contract(CONTRACT_ADDRESS, AC_ABI, aProvider)

    const fetchedEvents = await contract.queryFilter(EVENT_NAME, 0, currentBlkNum);
    setEvents(fetchedEvents)
  }
   
  function getEventTypes(EVENT_NAME) {

    const event = AC_ABI.find(item => item.type === 'event' && item.name === EVENT_NAME);
    if (!event) {
      console.log("No event found for event");
      throw new Error(`Event ${EVENT_NAME} not found in contract ABI`);
    }
    const eventTypes = event.inputs.map(input => input.type);
    return eventTypes;
  }

  const queryFilterWithEtherscan = async () => {
    const aProvider = new ethers.providers.EtherscanProvider(ETHER_NETWORK, process.env.REACT_APP_ETHERSCAN_KEY);
    setProvider(aProvider);
    setProviderName("Etherscan:" + aProvider.getBaseUrl());


    const url =  aProvider.getBaseUrl()
    console.log("Use Etherscan Provider URL:" + JSON.stringify(url));
    let currentBlkNum = await aProvider.getBlockNumber();

    const contract = await new ethers.Contract(CONTRACT_ADDRESS, AC_ABI, aProvider)

    const fetchedEvents = await contract.queryFilter(EVENT_NAME, 0, currentBlkNum);
    setEvents(fetchedEvents)
  }




  useEffect(() => {
    const fetchData = async () => {
      const rows = await Promise.all(
        events.map(async (event) => {
          const proposer =  event.args.sender
          const data =  event.args.data
          const blockNumber = event?.blockNumber

          return { proposer, data , blockNumber};
        })
      );
      setTableData(rows.sort((b, a) => a?.blockNumber - b?.blockNumber));
    };
    fetchData()
  }, [provider, providerName, events])

  return (
    <div>
    <div>PublishedEvents</div>
      <div className="providerList">
        <button onClick={queryFilterWithInfura}>Infura</button>
        <button onClick={queryFilterWithAlchemy}>Alchemy</button>
        <button onClick={queryFilterWithEtherscan}>Etherscan</button>
      </div>
      <div className="container">
        <p>Event List Table</p>
        <p>From {providerName}</p>
        <table>
        <th>Block Number</th> <th>Change Submission Account </th> <th> Account Owner  </th><th>   Change Instruction</th>
        {tableData.map( (entry) => (
          <tbody key={crypto.randomUUID()}>
          <tr key={crypto.randomUUID()}>
            <td>
              <EtherscanLink network={ETHER_NETWORK} assetType="block" address={entry?.blockNumber}/>
            </td>
            <td><EtherscanLink network={ETHER_NETWORK} assetType="address" address={entry?.proposer}/></td>
            <td>{lookupFunction(entry?.proposer)}</td>
            <td>{entry?.data}</td>
          </tr>
          </tbody>))}
        </table>
      </div>
  </div>
  )
}

export default PublishedEvents