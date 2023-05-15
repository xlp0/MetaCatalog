import {NavLink, Outlet} from 'react-router-dom'

const AnnouncementsLayout = () => {
  return (
    <div className="announcements-layout">
    <nav>
      <NavLink to="announcements">Announcements</NavLink>
      <NavLink to="prefeched">Prefetched</NavLink>
      <NavLink to="published_events">Published Events</NavLink>
    </nav>
      <Outlet />
    </div>
  )
}

export default AnnouncementsLayout