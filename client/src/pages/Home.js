
import ShowCaseBanner from '../components/ShowCaseBanner'
import {Link} from 'react-router-dom'


const Home = () => {

  return (
    <div>
      
      <div><img src="/img/eKatalog_Banner_v5.0.x.jpg" alt="HOME PAGE BANNER" height="300px"></img></div>
      <ShowCaseBanner />
      <div className="IPFS_LINK">
        <Link to={`http://ipfs.io/ipfs/${process.env.REACT_APP_IPFS_CID}?filename=OriginalLaptopData.json`} target="OTHERPAGE" rel="noopener noreferrer">To original data On IPFS</Link>
        <Link to={`${process.env.REACT_APP_IPFS_IMAGEFILES_LOCAL_ADDRESS}`} target="OTHERPAGE" rel="noopener noreferrer">To original image files On IPFS</Link>
      </div>
    </div>
  )
}

export default Home