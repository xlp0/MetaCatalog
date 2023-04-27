import { useState } from 'react'
import { Navigate } from 'react-router-dom';

const About = () => {

  const [user, setUser] = useState('mario');

    if (!user) {
      return <Navigate to="/" replace={true} />
    }

  return (
    <div className="about">
      <h2>About Us</h2>
    <button onClick={() => setUser(null)}>Logout</button>
    </div>
  )
}

export default About