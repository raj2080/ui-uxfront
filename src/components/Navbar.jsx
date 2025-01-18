import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated }) => {
  return (
    <div className='container'>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Confess <span className='text-danger'>here</span></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <form className="d-flex mx-auto me-5" role="search">
              <div className="input-group">
                <input className="form-control" style={{ width: '400px' }} type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-secondary" type="button"><i className="fas fa-search"></i></button>
              </div>
            </form>
            <ul className="navbar-nav mx-3 me-5 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#">Communities</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Contact us</a>
              </li>
              {isAuthenticated && (
                <li className="nav-item">
                  <a className="nav-link" href="#">Profile</a>
                </li>
              )}
            </ul>
            {!isAuthenticated && (
              <ul className="navbar-nav ms-2 mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link to={'/register'} className="btn btn-success" type="button">Register</Link>
                </li>
                <li className="nav-item ms-2">
                  <Link to={'/login'} className="btn btn-primary" type="button">Login</Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;