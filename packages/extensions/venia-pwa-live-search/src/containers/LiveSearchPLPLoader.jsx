import React from 'react';
import LiveSearchPLP from '../index';
import { useLiveSearchPLPConfig } from '../hooks/useLiveSearchPLPConfig';
import { ResultsModifierProvider } from '../context/resultsModifierContext';

export const LiveSearchPLPLoader = ({categoryId}) => {
  const { config, loading, error } = useLiveSearchPLPConfig({categoryId});

  if (loading) {
    return <div></div>;
  }
  //console.log("Error LIVE SEARCH : ",error);
  //console.log("Config LS : ", config);
  if (error || !config) {
    return <div>Error loading Live Search configuration</div>;
  }

  console.log("config details : ", config);

  //return <LiveSearchPLP storeDetails={config} />;
  return (
    <ResultsModifierProvider baseUrl={config?.baseUrl} baseUrlWithoutProtocol={config?.baseUrlwithoutProtocol}>
      <LiveSearchPLP storeDetails={config} />
    </ResultsModifierProvider>
  );
};

export default LiveSearchPLPLoader;
