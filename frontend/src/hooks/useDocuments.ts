import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Document } from '../types/document';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';

export interface EnhancedDocument extends Document {
  invoiceId?: number | null;
  access?: number[];
  isVerified?: boolean | null;
}

export const useDocuments = (contractId?: number, invoiceId?: number, userId?: number) => {
  const { toast } = useToast();
  const { user } = useWeb3();
  
  // If userId not provided, use the current user's ID
  const currentUserId = userId || (user?.id as number);
  
  // Get all documents
  const {
    data: allDocuments = [],
    isLoading: isLoadingAllDocuments,
    error: allDocumentsError,
    refetch: refetchAllDocuments,
  } = useQuery({
    queryKey: ['/api/documents'],
    enabled: !contractId && !invoiceId && !userId,
  });
  
  // Get documents for a specific contract
  const {
    data: contractDocuments = [],
    isLoading: isLoadingContractDocuments,
    error: contractDocumentsError,
    refetch: refetchContractDocuments,
  } = useQuery({
    queryKey: ['/api/contracts', contractId, 'documents'],
    queryFn: async () => {
      if (!contractId) return [];
      const res = await apiRequest('GET', `/api/contracts/${contractId}/documents`);
      return res.json();
    },
    enabled: !!contractId,
  });
  
  // Get documents for a specific invoice
  const {
    data: invoiceDocuments = [],
    isLoading: isLoadingInvoiceDocuments,
    error: invoiceDocumentsError,
    refetch: refetchInvoiceDocuments,
  } = useQuery({
    queryKey: ['/api/invoices', invoiceId, 'documents'],
    queryFn: async () => {
      if (!invoiceId) return [];
      const res = await apiRequest('GET', `/api/invoices/${invoiceId}/documents`);
      return res.json();
    },
    enabled: !!invoiceId,
  });
  
  // Get accessible documents for a user
  const {
    data: userAccessibleDocuments = [],
    isLoading: isLoadingUserDocuments,
    error: userDocumentsError,
    refetch: refetchUserDocuments,
  } = useQuery({
    queryKey: ['/api/users', currentUserId, 'documents'],
    queryFn: async () => {
      if (!currentUserId) return [];
      const res = await apiRequest('GET', `/api/users/${currentUserId}/documents`);
      return res.json();
    },
    enabled: !!currentUserId && !contractId && !invoiceId,
  });
  
  // Determine which document set to use
  let documents = allDocuments;
  let isLoading = isLoadingAllDocuments;
  let error = allDocumentsError;
  let refetch = refetchAllDocuments;
  
  if (contractId) {
    documents = contractDocuments;
    isLoading = isLoadingContractDocuments;
    error = contractDocumentsError;
    refetch = refetchContractDocuments;
  } else if (invoiceId) {
    documents = invoiceDocuments;
    isLoading = isLoadingInvoiceDocuments;
    error = invoiceDocumentsError;
    refetch = refetchInvoiceDocuments;
  } else if (currentUserId) {
    documents = userAccessibleDocuments;
    isLoading = isLoadingUserDocuments;
    error = userDocumentsError;
    refetch = refetchUserDocuments;
  }
  
  // Upload document
  const uploadDocumentMutation = useMutation({
    mutationFn: async ({ 
      file, 
      contractId, 
      invoiceId, 
      tags = [], 
      access = [] 
    }: { 
      file: File, 
      contractId?: number, 
      invoiceId?: number,
      tags?: string[],
      access?: number[]
    }) => {
      // In a real app, you'd upload to a file storage service and get back a URL and hash
      // For this demo, we're creating a simulated document record
      const simulatedHash = `hash_${Math.random().toString(36).substring(2, 15)}`;
      const simulatedUrl = `https://example.com/documents/${simulatedHash}`;
      
      const documentData = {
        name: file.name,
        type: file.type,
        size: file.size,
        hash: simulatedHash,
        url: simulatedUrl,
        contractId: contractId || null,
        invoiceId: invoiceId || null,
        uploadedBy: user?.walletAddress || "current_user_wallet_address",
        tags,
        access
      };
      
      const response = await apiRequest('POST', '/api/documents', documentData);
      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      
      if (variables.contractId) {
        queryClient.invalidateQueries({ queryKey: ['/api/contracts', variables.contractId, 'documents'] });
      }
      
      if (variables.invoiceId) {
        queryClient.invalidateQueries({ queryKey: ['/api/invoices', variables.invoiceId, 'documents'] });
      }
      
      if (currentUserId) {
        queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'documents'] });
      }
      
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Document Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    },
  });
  
  // Update document
  const updateDocumentMutation = useMutation({
    mutationFn: async ({ id, documentData }: { id: number, documentData: Partial<EnhancedDocument> }) => {
      const res = await apiRequest('PATCH', `/api/documents/${id}`, documentData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      
      if (contractId) {
        queryClient.invalidateQueries({ queryKey: ['/api/contracts', contractId, 'documents'] });
      }
      
      if (invoiceId) {
        queryClient.invalidateQueries({ queryKey: ['/api/invoices', invoiceId, 'documents'] });
      }
      
      if (currentUserId) {
        queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'documents'] });
      }
      
      toast({
        title: "Document Updated",
        description: "The document has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "There was an error updating the document.",
        variant: "destructive",
      });
    }
  });
  
  // Delete document
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: number) => {
      await apiRequest('DELETE', `/api/documents/${documentId}`);
      return documentId;
    },
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      
      if (contractId) {
        queryClient.invalidateQueries({ queryKey: ['/api/contracts', contractId, 'documents'] });
      }
      
      if (invoiceId) {
        queryClient.invalidateQueries({ queryKey: ['/api/invoices', invoiceId, 'documents'] });
      }
      
      if (currentUserId) {
        queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'documents'] });
      }
      
      toast({
        title: "Document Deleted",
        description: "The document has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Document Deletion Failed",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });
  
  // Grant document access to users
  const grantAccessMutation = useMutation({
    mutationFn: async ({ documentId, userIds }: { documentId: number, userIds: number[] }) => {
      const res = await apiRequest('POST', `/api/documents/${documentId}/access`, { userIds });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      
      if (currentUserId) {
        queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'documents'] });
      }
      
      toast({
        title: "Access Granted",
        description: "Access to the document has been granted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Access Grant Failed",
        description: error.message || "There was an error granting access to the document.",
        variant: "destructive",
      });
    }
  });
  
  // Revoke document access from users
  const revokeAccessMutation = useMutation({
    mutationFn: async ({ documentId, userIds }: { documentId: number, userIds: number[] }) => {
      const res = await apiRequest('DELETE', `/api/documents/${documentId}/access`, { userIds });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      
      if (currentUserId) {
        queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'documents'] });
      }
      
      toast({
        title: "Access Revoked",
        description: "Access to the document has been revoked successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Access Revocation Failed",
        description: error.message || "There was an error revoking access to the document.",
        variant: "destructive",
      });
    }
  });
  
  // Verify document
  const verifyDocumentMutation = useMutation({
    mutationFn: async ({ documentId, verified }: { documentId: number, verified: boolean }) => {
      const res = await apiRequest('POST', `/api/documents/${documentId}/verify`, { verified });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      
      if (contractId) {
        queryClient.invalidateQueries({ queryKey: ['/api/contracts', contractId, 'documents'] });
      }
      
      if (invoiceId) {
        queryClient.invalidateQueries({ queryKey: ['/api/invoices', invoiceId, 'documents'] });
      }
      
      toast({
        title: "Document Verified",
        description: "The document has been verified successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "There was an error verifying the document.",
        variant: "destructive",
      });
    }
  });
  
  return {
    documents,
    isLoading,
    error,
    refetch,
    uploadDocument: uploadDocumentMutation.mutate,
    isUploading: uploadDocumentMutation.isPending,
    updateDocument: updateDocumentMutation.mutate,
    isUpdating: updateDocumentMutation.isPending,
    deleteDocument: deleteDocumentMutation.mutate,
    isDeleting: deleteDocumentMutation.isPending,
    grantAccess: grantAccessMutation.mutate,
    isGrantingAccess: grantAccessMutation.isPending,
    revokeAccess: revokeAccessMutation.mutate,
    isRevokingAccess: revokeAccessMutation.isPending,
    verifyDocument: verifyDocumentMutation.mutate,
    isVerifying: verifyDocumentMutation.isPending,
  };
};
