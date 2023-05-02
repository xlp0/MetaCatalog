import {NavLink, Outlet, useNavigate} from 'react-router-dom'
import { FaSearch } from 'react-icons/fa';
import Breadcrumbs from '../components/Breadcrumbs'
import { useState, useEffect } from 'react'
import LanguageIconList from '../components/LanguageIconList'
import { useSelector, useDispatch } from 'react-redux'
import { getLanguages } from '../features/languages/languageSlice'

const RootLayout = ( knownLanguages ) => {
  const [languages, setLanguages] = useState([]);
  const [hasSearchResult, setHasSearchResult] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { availableLanguages, isLoading } = useSelector(
    (state) => state.languages
  )
  
  useEffect(() => {    
    const sendDispatch = async () => {
      await dispatch(getLanguages())
    }
    sendDispatch();
  }, []);

  useEffect(() => {
    if (!isLoading && !(availableLanguages === undefined) && availableLanguages.length > 0) {
      setLanguages(availableLanguages)
      console.log(availableLanguages)
    }else if (isLoading){
      console.log("LANGUAGE SERVICE IS LOADING...")
    }
  }, [availableLanguages, isLoading])

  const search = (e) => {
    e.preventDefault();
    console.log(e.target.searchStr.value)
    e.target.searchStr.value =""
    navigate("products")
  }

  return (
    <div className="root-layout">
        <header className="main-header-wrapper">
          <div className="helper-menu">
        <div className="container-fluid">
          <LanguageIconList languages={availableLanguages}/>
        </div>
        </div>

            <nav>
              <a className="navbar-brand" href="/">
                <div><img className="img-responsive" src="/img/e_cat_logo.png" alt="eCatalog logo" ></img></div>
              </a>
              <div>
                <form className="searchForm" onSubmit={search}>
                  <div className="searchForm">
                    
                    <input className="borderedInput" id='searchStr' type='text' placeholder="Type content to be searched" />
                    <button type='submit' className="searchButton"><FaSearch /></button>
                    
                  </div>
                </form>
              </div>
              <div>
                  <a className="navbar-brand" href="/">
                    Login
                  </a>
              </div>
            </nav>
            <Breadcrumbs />
        </header>
        <nav>
            <div className="navigationLinkBar">
                <NavLink to="/">Home</NavLink>
                <NavLink to="products">Products</NavLink>
                <NavLink to="announcement">Announcements</NavLink>
                <NavLink to="help">Help</NavLink>
                <NavLink to="career">Careers</NavLink>
                <NavLink to="about">About</NavLink>
              </div>
        </nav>
        <main>
            <Outlet />
        </main>

    </div>
  )
}

export default RootLayout