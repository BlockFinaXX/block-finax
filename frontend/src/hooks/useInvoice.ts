import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  contractId: number | null;
  sellerId: number;
  buyerId: number;
  amount: string;
  currency: string;
  issueDate: Date;
  dueDate: Date;
  status: string;
  items: InvoiceItem[];
  paymentTerms: string | null;
  notes: string | null;
}

export const useInvoice = (userId?: number, invoiceId?: number, contractId?: number) => {
  const { toast } = useToast();
  const { user } = useWeb3();

  // If userId not provided, use the current user's ID
  const currentUserId = userId || (user?.id as number);

  // Get user's invoices (as seller or buyer)
  const {
    data: invoices = [],
    isLoading: isLoadingInvoices,
    error: invoicesError,
    refetch: refetchInvoices,
  } = useQuery({
    queryKey: ['/api/invoices', { userId: currentUserId }],
    queryFn: async () => {
      if (!currentUserId) return [];
      const res = await apiRequest('GET', `/api/invoices?userId=${currentUserId}`);
      return res.json();
    },
    enabled: !!currentUserId,
  });

  // Get user's seller invoices
  const {
    data: sellerInvoices = [],
    isLoading: isLoadingSellerInvoices,
    error: sellerInvoicesError,
    refetch: refetchSellerInvoices,
  } = useQuery({
    queryKey: ['/api/invoices', { userId: currentUserId, role: 'seller' }],
    queryFn: async () => {
      if (!currentUserId) return [];
      const res = await apiRequest('GET', `/api/invoices?userId=${currentUserId}&role=seller`);
      return res.json();
    },
    enabled: !!currentUserId,
  });

  // Get user's buyer invoices
  const {
    data: buyerInvoices = [],
    isLoading: isLoadingBuyerInvoices,
    error: buyerInvoicesError,
    refetch: refetchBuyerInvoices,
  } = useQuery({
    queryKey: ['/api/invoices', { userId: currentUserId, role: 'buyer' }],
    queryFn: async () => {
      if (!currentUserId) return [];
      const res = await apiRequest('GET', `/api/invoices?userId=${currentUserId}&role=buyer`);
      return res.json();
    },
    enabled: !!currentUserId,
  });

  // Get single invoice
  const {
    data: invoice,
    isLoading: isLoadingInvoice,
    error: invoiceError,
    refetch: refetchInvoice,
  } = useQuery({
    queryKey: ['/api/invoices', invoiceId],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/invoices/${invoiceId}`);
      return res.json();
    },
    enabled: !!invoiceId,
  });

  // Get contract invoices
  const {
    data: contractInvoices = [],
    isLoading: isLoadingContractInvoices,
    error: contractInvoicesError,
    refetch: refetchContractInvoices,
  } = useQuery({
    queryKey: ['/api/contracts', contractId, 'invoices'],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/contracts/${contractId}/invoices`);
      return res.json();
    },
    enabled: !!contractId,
  });

  // Create invoice
  const createInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: {
      invoiceNumber: string;
      sellerId: number;
      buyerId: number;
      amount: string;
      currency: string;
      dueDate: Date;
      items: InvoiceItem[];
      contractId?: number;
      paymentTerms?: string;
      notes?: string;
    }) => {
      const res = await apiRequest('POST', '/api/invoices', invoiceData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      if (contractId) {
        queryClient.invalidateQueries({ queryKey: ['/api/contracts', contractId, 'invoices'] });
      }
      toast({
        title: "Invoice Created",
        description: "Your invoice has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Invoice Creation Failed",
        description: error.message || "There was an error creating the invoice.",
        variant: "destructive",
      });
    },
  });

  // Update invoice
  const updateInvoiceMutation = useMutation({
    mutationFn: async ({ id, invoiceData }: { id: number, invoiceData: Partial<Invoice> }) => {
      const res = await apiRequest('PATCH', `/api/invoices/${id}`, invoiceData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      if (invoiceId) {
        queryClient.invalidateQueries({ queryKey: ['/api/invoices', invoiceId] });
      }
      if (contractId) {
        queryClient.invalidateQueries({ queryKey: ['/api/contracts', contractId, 'invoices'] });
      }
      toast({
        title: "Invoice Updated",
        description: "The invoice has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Invoice Update Failed",
        description: error.message || "There was an error updating the invoice.",
        variant: "destructive",
      });
    },
  });

  // Pay invoice
  const payInvoiceMutation = useMutation({
    mutationFn: async ({ id, fromWalletId }: { id: number, fromWalletId: number }) => {
      const res = await apiRequest('POST', `/api/invoices/${id}/pay`, { fromWalletId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      if (invoiceId) {
        queryClient.invalidateQueries({ queryKey: ['/api/invoices', invoiceId] });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'transactions'] });
      toast({
        title: "Payment Successful",
        description: "The invoice has been paid successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error paying the invoice.",
        variant: "destructive",
      });
    },
  });

  return {
    // Invoice data
    invoices,
    sellerInvoices,
    buyerInvoices,
    invoice,
    contractInvoices,
    // Loading states
    isLoadingInvoices,
    isLoadingSellerInvoices,
    isLoadingBuyerInvoices,
    isLoadingInvoice,
    isLoadingContractInvoices,
    // Errors
    invoicesError,
    sellerInvoicesError,
    buyerInvoicesError,
    invoiceError,
    contractInvoicesError,
    // Refetch functions
    refetchInvoices,
    refetchSellerInvoices,
    refetchBuyerInvoices,
    refetchInvoice,
    refetchContractInvoices,
    // Mutations
    createInvoiceMutation,
    updateInvoiceMutation,
    payInvoiceMutation,
  };
};