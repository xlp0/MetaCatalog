import {ethers} from 'ethers'

// import CS_ABI from '../../features/blockchain/ChangeSuggestion_abi.json'
// import SS_ABI from '../../features/blockchain/SimpleStore_abi.json'
import AC_ABI from '../../features/blockchain/AccountableChange_abi.json'
import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'

const PublishedEvents = () => {
  
  const ETHER_NETWORK = process.env.REACT_APP_ETHEREUM_NETWORK
  const ETHERSCAN_PREFIX = `${ETHER_NETWORK}` ? `https://${ETHER_NETWORK}.etherscan.io/` : "https://etherscan.io/"
  const CONTRACT_ADDRESS = process.env.REACT_APP_ACCOUNTABLE_CHANGE_CONTRACT_ADDRESS
  const eventName = "ChangeSubmitted"
  
  const accountDictionary = {
    "0x372C68C90f433C54c4AE06b4Ddf107ce8baB67Cc": "LKPP",
    "0xF1E4cc03796c2d37d502CC484E3b67fB9Bf4E479": "Vendor 001",
    "0x1c117Eb98169f2a81A17e18C07bD5ca44ee56411": "Finance Department",
    "0xDd83c5776c274e78bD55Db135AA43210e838F5c8": "Transportation Department",
  }

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
   
  function getEventTypes(eventName) {

    const event = AC_ABI.find(item => item.type === 'event' && item.name === eventName);
    if (!event) {
      console.log("No event found for event");
      throw new Error(`Event ${eventName} not found in contract ABI`);
    }
    const eventTypes = event.inputs.map(input => input.type);
    return eventTypes;
  }

  const queryFilterWithEtherscan = async () => {
    const aProvider = new ethers.providers.EtherscanProvider("goerli", process.env.REACT_APP_ETHERSCAN_KEY);
    setProvider(aProvider);
    setProviderName("Etherscan:" + aProvider.getBaseUrl());
    const eventTypes = getEventTypes(eventName);

    const eventInterface = new ethers.utils.Interface([`event ${eventName}(${eventTypes.join(',')})`]);
    const eventSignature = eventInterface.getEventTopic(eventName);
    console.log("eventSignature:" + JSON.stringify(eventSignature))

    const url =  aProvider.getBaseUrl()
    console.log("Use Etherscan Provider URL:" + JSON.stringify(url));
    let currentBlkNum = await aProvider.getBlockNumber();
    console.log("Current Block Number" + currentBlkNum);
    const block = await provider.getBlock(currentBlkNum);
    const timestamp = block.timestamp;
    const date = new Date(timestamp * 1000);
    console.log("Current Block's Timestamp:" + date.toLocaleString())


    const contract = await new ethers.Contract(CONTRACT_ADDRESS, AC_ABI, aProvider)

    const fetchedEvents = await contract.queryFilter(eventName, 0, currentBlkNum);
    await insertTimeStampForBlocksInFetchedEvents(events)
    setEvents(fetchedEvents.reverse())
  }

  const insertTimeStampForBlocksInFetchedEvents =async ( events ) => {
    console.log(`Hello Events ${JSON.stringify(events)}`);

    events.forEach((event) => {
      const blockNumber = event.blockNumber;
      provider.getBlock(blockNumber).then((block) => {
        const timestamp = block.timestamp;
        const aNewDate = new Date(timestamp * 1000)
        event.timestamp = aNewDate
        console.log(`Event occurred at ${event.timestamp}`);
      })
    })
  }



  useEffect(() => {
    const fetchData = async () => {
      const rows = await Promise.all(
        events.map(async (event) => {
          const proposer =  event.args.sender
          const data =  event.args.data
          const blockNumber = event?.blockNumber
          const timestamp = event?.timestamp

          return { proposer, data , blockNumber, timestamp};
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
      <div className="providerList">
        <button onClick={queryFilterWithInfura}>Infura</button>
        <button onClick={queryFilterWithAlchemy}>Alchemy</button>
        <button onClick={queryFilterWithEtherscan}>Etherscan</button>
      </div>
      <div className="container">
        <p>Event List Table</p>
        <p>From {providerName}</p>
        <table>
        <th>Block Number</th> <th>Change Submission Account </th><th>   Change Instruction</th>
        {tableData.map( (entry) => (
          <tbody key={crypto.randomUUID()}>
          <tr key={crypto.randomUUID()}>
            <td><Link to={`${ETHERSCAN_PREFIX}/block/${entry?.blockNumber}`} target="_blank" rel="noopener noreferrer">{entry?.blockNumber}</Link></td>
            <td><Link to={`${ETHERSCAN_PREFIX}/address/${entry?.proposer}`} target="_blank" rel="noopener noreferrer">{entry?.proposer}</Link></td>
            <td>{entry?.data}</td>
          </tr>
          </tbody>))}
        </table>
      </div>
  </div>
  )
}

export default PublishedEvents