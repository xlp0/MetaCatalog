import {NavLink, Outlet} from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { useState, useEffect } from 'react'
import LanguageIconList from '../components/LanguageIconList'
import { useSelector, useDispatch } from 'react-redux'
import { getLanguages } from '../features/languages/languageSlice'

const RootLayout = ( knownLanguages ) => {
  const [languages, setLanguages] = useState([]);

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

  return (
    <div className="root-layout">
        <header className="main-header-wrapper">
          <div className="helper-menu">
        <div className="container-fluid">
          <LanguageIconList languages={availableLanguages}/>
        </div>
        </div>

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