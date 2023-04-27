import React from 'react'
import {NavLink, Outlet} from 'react-router-dom'


const CareersLayout = () => {
  return (
    <div className="careers-layout">
      <h2>Careers</h2>
      <nav>
            <NavLink to="careerDetails">Career Details</NavLink>
            <NavLink to="careers">Careers</NavLink>
        </nav>
        <Outlet />
    </div>
  )
}

export default CareersLayout