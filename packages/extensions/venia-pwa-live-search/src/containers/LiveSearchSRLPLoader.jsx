import React from 'react';
import LiveSearchPLP from '../index';
import { useLiveSearchSRLPConfig } from '../hooks/useLiveSearchSRLPConfig';

export const LiveSearchSRLPLoader = () => {
  const { config, loading, error } = useLiveSearchSRLPConfig();

  if (loading) {
    return <div></div>;
  }
  //console.log("Error LIVE SEARCH : ",error);
  //console.log("Config LS : ", config);
  if (error || !config) {
    return <div>Error loading Live Search configuration</div>;
  }

  //console.log("config details : ", config);

  return <LiveSearchPLP storeDetails={config} />;
};

export default LiveSearchSRLPLoader;
