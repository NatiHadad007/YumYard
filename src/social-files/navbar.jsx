import React from 'react'
import { Link } from 'react-router-dom'
import { BiSearchAlt } from 'react-icons/bi'
import AuthProfileUser from './AuthProfileUser.jsx'
const Navbar = () => {
  return (
    <div className="navBar">
          <div className="navElementWrapper">
            <Link className="siteName-link" to="/">
              <h1 className="siteName">YumYum</h1>
            </Link>
            <div className="searchInputContainer">
              <BiSearchAlt className="searchIcon" />
              <input
                className="searchInput"
                type="text"
                placeholder="Search..."
              />
            </div>
            <AuthProfileUser />
          </div>
        </div>
  )
}

export default Navbar