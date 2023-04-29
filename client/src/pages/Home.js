
import ShowCaseBanner from '../components/ShowCaseBanner'
import WalletConnection from '../components/WalletConnection'


const Home = () => {

  return (
    <div>
      <div><img src="/img/eKatalog_Banner_v5.0.x.jpg" alt="HOME PAGE BANNER" height="300px"></img></div>
      <ShowCaseBanner />
      <WalletConnection />
    </div>
  )
}

export default Home