import React, { useEffect } from 'react';

const Documentation = () => {
  useEffect(() => {
    // Redirect to the specified URL
    window.location.href = 'https://documenter.getpostman.com/view/30673182/2sAYBPmZun';
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return null; // No UI is rendered since the user is redirected
};

export default Documentation;
