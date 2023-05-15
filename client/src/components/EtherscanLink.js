import { Link } from 'react-router-dom';
import { shortenedAccountString } from '../hooks/formatters'


const EtherscanLink = ({network, assetType, address}) => {

const url = `https://${network}.etherscan.io/${assetType}/${address}`;

  return (
    <Link to={url} target="_blank" rel="noopener noreferrer">
      {shortenedAccountString(address)}
    </Link>
  )
}

export default EtherscanLink