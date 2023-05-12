import { useSelector } from "react-redux";
import {selectEtherScanChangeSubmission} from '../../features/blockchain/ethereum/ChangeSubmissionSlice'
import {Link} from 'react-router-dom'

const PrefetchedEvents = () => {
    const tableData = useSelector(selectEtherScanChangeSubmission);
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