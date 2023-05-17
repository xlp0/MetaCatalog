import { useSelector } from "react-redux";
import {selectChangeSubmissionEvents} from '../../features/blockchain/ethereum/ChangeSubmissionSlice'
import { useEffect, useState } from "react";
import EtherscanLink from "../../components/EtherscanLink";

const PrefetchedEvents = () => {
    const tableData = useSelector(selectChangeSubmissionEvents);
    const [eventList, setEventList] = useState([])

    useEffect(() => {
      if (tableData != null) {
         setEventList(tableData)  
      }
    }, [tableData]);

  return (
    <section>
    <div>PrefetchedEvents</div>
    <table>
        <thead>
          <tr>
            <th> Block Number </th>
            <th> Change Submission Account </th>
            <th> Change Instruction </th>
          </tr>
        </thead>
        {eventList.map( (entry) => (
          <tbody key={crypto.randomUUID()}>
          <tr key={crypto.randomUUID()}>
            <td><EtherscanLink network={process.env.REACT_APP_ETHEREUM_NETWORK} assetType="block" address={entry?.blockNumber}/></td>
            <td><EtherscanLink network={process.env.REACT_APP_ETHEREUM_NETWORK} assetType="address" address={entry?.sender}/></td>
            <td>{entry?.data}</td>
          </tr>
          </tbody>))}
        </table>
    </section>
  )
}

export default PrefetchedEvents