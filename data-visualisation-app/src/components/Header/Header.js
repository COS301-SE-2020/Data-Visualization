import React from 'react';

function Header({ home, about }) {
  return (
    <header>
      <h1>Data Visualization</h1>
      <nav>
        <ul>
          <li>
            <div className='nav' onClick={home}>
              My Dashboards
            </div>
          </li>
          <li>
            <div className='nav' onClick={about}>
              About
            </div>
          </li>
          <li>{/* <div className='nav' onClick={home}>
              Home
            </div> */}</li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
