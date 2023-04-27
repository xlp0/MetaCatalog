import {NavLink, Outlet} from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'

const RootLayout = () => {
  return (
    <div className="root-layout">
        <header>
            <nav>
              <div className="header nav"><h1><a href="http://lkpp.go.id" >LKPP</a></h1></div>
              <div><img src="/img/e_cat_logo.png" alt="eCatalog logo" height="40px"></img></div>
              <div>
                <NavLink to="/">Home</NavLink>
                <NavLink to="products">Products</NavLink>
                <NavLink to="announcement">Announcements</NavLink>
                <NavLink to="help">Help</NavLink>
                <NavLink to="career">Careers</NavLink>
                <NavLink to="about">About</NavLink>
              </div>
            </nav>
            <Breadcrumbs />
        </header>
        <main>
            <Outlet />
        </main>
    </div>
  )
}

export default RootLayout