import React from 'react';

function AboutPage({ about }) {
  return (
    <div>
      <div className='title'>About</div>
      <div>{about}</div>
    </div>
  );
}

export default AboutPage;
