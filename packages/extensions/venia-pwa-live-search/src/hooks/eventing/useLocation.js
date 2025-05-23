import { useLocation as useLocationDriver } from 'react-router-dom';
import { useEffect, useState } from 'react';

// This thin wrapper prevents us from having references to venia drivers literred around the code
const useLocation = () => {
  const locationDriver = useLocationDriver();
  const [location, setLocation] = useState(locationDriver);

  useEffect(() => {
    // Location consistency described here (https://reactrouter.com/web/api/Hooks/uselocation)
    // is disrupted by Venia's implementation. This wrapper ensures that location
    // only changes when the user navigates
    if (locationDriver.pathname !== location.pathname) {
      setLocation(locationDriver);
    }
  }, [locationDriver, location.pathname]);

  return location;
};

export default useLocation;
