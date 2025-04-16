import React, { useState } from 'react';
import { useLocation } from 'wouter';
import ContractList from './ContractList';
import ContractForm from './ContractForm';
import ContractDetails from './ContractDetails';

const ContractsPage = () => {
  const [location] = useLocation();
  
  // Extract the contract ID from the URL if we're on a contract details page
  const contractId = location.startsWith('/contracts/') && location !== '/contracts/new' 
    ? location.split('/contracts/')[1] 
    : null;
  
  // Determine which component to render based on the URL
  if (location === '/contracts/new') {
    return <ContractForm />;
  } else if (contractId) {
    return <ContractDetails contractId={contractId} />;
  } else {
    return <ContractList />;
  }
};

export default ContractsPage;
