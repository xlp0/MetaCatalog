import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div>
        <h2>Page Not Found</h2>
        <p>This routed page is not defined in your component tree.</p>
        <p>Go to the <Link to ="/">Home Page</Link></p>
    </div>
  )
}

export default NotFound