import React from 'react';
import LiveSearchPLP from '../index';
import { useLiveSearchPLPConfig } from '../hooks/useLiveSearchPLPConfig';
import { ResultsModifierProvider } from '../context/resultsModifierContext';

export const LiveSearchPLPLoader = ({categoryId}) => {
  const { config, loading, error } = useLiveSearchPLPConfig({categoryId});

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

export default LiveSearchPLPLoader;
