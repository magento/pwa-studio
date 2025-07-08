import React from 'react';
import LiveSearchPLP from '../index';
import { useLiveSearchSRLPConfig } from '../hooks/useLiveSearchSRLPConfig';
import { ResultsModifierProvider } from '../context/resultsModifierContext';

export const LiveSearchSRLPLoader = () => {
  const { config, loading, error } = useLiveSearchSRLPConfig();

  if (loading) {
    return <div></div>;
  }
 
  if (error || !config) {
    return <div>Error loading Live Search configuration</div>;
  }

  return (
    <ResultsModifierProvider baseUrl={config?.baseUrl} baseUrlWithoutProtocol={config?.baseUrlwithoutProtocol}>
      <LiveSearchPLP storeDetails={config} />
    </ResultsModifierProvider>
  );
};

export default LiveSearchSRLPLoader;
