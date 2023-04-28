// import React, { useEffect, useState } from 'react'
import {ethers} from 'ethers'
import CS_ABI from '../../features/blockchain/ChangeSuggestion_abi.json'

// const PROVIDER_URL = process.env.REACT_APP_ALCHEMY_BASE_URL;
// const PROVIDER_API_KEY = process.env.REACT_APP_ALCHEMY_KEY;

// const nodeProvider = `${PROVIDER_URL}/${PROVIDER_API_KEY}`;

const Announcements = () => {

  const provider = new ethers.providers.InfuraProvider("goerli", process.env.REACT_APP_INFURA_PROJECT_ID);
  const eventName = "ChangeSuggestionSubmitted"


  const startListeningToEvents = () => {
    console.log("startListeningToEvents fired!")

      const connect =  async () => {
        const contract = await new ethers.Contract(process.env.REACT_APP_CHANGE_EVENT_CONTRACT_ADDRESS, CS_ABI, provider)
        contract.on(eventName, (proposer, data, event) => {
          let res = {
            proposer,
            data,
            event
          }
        console.log(res)
        // const filter = contract.filters[eventName]();
        console.log("Filters in contract:" + JSON.stringify(contract.filters))

        console.log("Contract event data:" + JSON.stringify(contract.queryFilter(eventName, 8662347 - 10000, 8662347)))
      })
      }
      connect();
  }

  const showBlockNumber = async () => {
    let currentBlkNum = await provider.getBlockNumber();
    console.log("Current Block Number" + currentBlkNum);

    const eventSig = eventName+'(address,string)'
    const eventTopic = ethers.utils.id(eventSig)

    let rawLogs = await provider.getLogs({
      address:process.env.REACT_APP_CHANGE_EVENT_CONTRACT_ADDRESS,
      topics: [eventTopic],
      fromBlock: 0,
      toBlock: currentBlkNum
    })

    // console.log(rawLogs)

    const abi_interface = new ethers.utils.Interface(CS_ABI);

    rawLogs.forEach((log) => {
      // console.log(`BEFORE PARSING:`);
      // console.log(log);
      // console.log(`\n`);

      console.log(`AFTER PARSING:`);
      let parsedLog = abi_interface.parseLog(log);
      console.log(parsedLog);
      console.log('************************************************');
  })

  }

  const queryFilter = async () => {
    console.log('*************Query Filter*******************');
    let currentBlkNum = await provider.getBlockNumber();
    console.log("Current Block Number" + currentBlkNum);

    const eventSig = eventName+'(address,string)'
    const eventTopic = ethers.utils.id(eventSig)

    const contract = await new ethers.Contract(process.env.REACT_APP_CHANGE_EVENT_CONTRACT_ADDRESS, CS_ABI, provider)

    let filter = {
      address:process.env.REACT_APP_CHANGE_EVENT_CONTRACT_ADDRESS,
      topics: [eventTopic],
      fromBlock: 0,
      toBlock: currentBlkNum
    }

    const events = await contract.queryFilter(filter, 0, currentBlkNum);
    console.log("Contract event data:" + JSON.stringify(events))

    console.log(events[18].args.data)


  }

  return (
      <div>
        <div>Announcements</div>
        <button onClick={startListeningToEvents}>Start Listening to Events</button>

        <button onClick={showBlockNumber}>Show Block Number</button>

        <button onClick={queryFilter}>Use Query Filter</button>


      </div>
  )
  
}

export default Announcements
