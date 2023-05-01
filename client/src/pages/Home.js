
import ShowCaseBanner from '../components/ShowCaseBanner'
import WalletConnection from '../components/WalletConnection'
import {Link} from 'react-router-dom'


const Home = () => {

  return (
    <div>
      
      <div><img src="/img/eKatalog_Banner_v5.0.x.jpg" alt="HOME PAGE BANNER" height="300px"></img></div>
      <ShowCaseBanner />
      <WalletConnection />

      <Link to={`http://${process.env.REACT_APP_IPFS_CONTENT_MULTIHASH}.ipfs.localhost:8080`} target="OTHERPAGE" rel="noopener noreferrer">TO THE ORIGINAL DATA</Link>
    </div>
  )
}

export default Home