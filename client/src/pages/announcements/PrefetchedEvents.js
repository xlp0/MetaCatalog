import { useSelector } from "react-redux";
import {selectEtherScanChangeSubmission} from '../../features/blockchain/ethereum/ChangeSubmissionSlice'
import {Link} from 'react-router-dom'
import { useEffect, useState } from "react";

const PrefetchedEvents = () => {
    const tableData = useSelector(selectEtherScanChangeSubmission);

    useEffect(() => {
      console.log("useEffect triggered because tableData changed"+ JSON.stringify(tableData[tableData.length-1]));
    }, [tableData]);

  return (
    <section>
    <div>PrefetchedEvents</div>
    <table>
        <th>Change Submission Account </th><th>   Change Instruction</th>
        {tableData.map( (entry) => (
          <tbody key={crypto.randomUUID()}>
          <tr key={crypto.randomUUID()}>
            <td><Link to={`${entry?.proposer}`} target="_blank" rel="noopener noreferrer">{entry?.proposer}</Link></td>
            <td>{entry?.data}</td>
          </tr>
          </tbody>))}
        </table>
    </section>
  )
}

export default PrefetchedEvents