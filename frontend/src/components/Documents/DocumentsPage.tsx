import React from 'react';
import { useLocation } from 'wouter';
import DocumentList from './DocumentList';
import DocumentUpload from './DocumentUpload';

const DocumentsPage = () => {
  const [location] = useLocation();
  
  if (location === '/documents/upload') {
    return <DocumentUpload />;
  } else {
    return <DocumentList />;
  }
};

export default DocumentsPage;
