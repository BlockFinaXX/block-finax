import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';

interface TradeFinanceApplication {
  id: number;
  userId: number;
  contractId: number | null;
  applicationType: string;
  amount: string;
  currency: string;
  status: string;
  applicationDate: Date;
  approvalDate: Date | null;
  expiryDate: Date | null;
  terms: Record<string, any> | null;
  supportingDocuments: string[] | null;
}

export const useTradeFinance = (userId?: number, applicationId?: number, contractId?: number) => {
  const { toast } = useToast();
  const { user } = useWeb3();

  // If userId not provided, use the current user's ID
  const currentUserId = userId || (user?.id as number);

  // Get user's applications
  const {
    data: applications = [],
    isLoading: isLoadingApplications,
    error: applicationsError,
    refetch: refetchApplications,
  } = useQuery({
    queryKey: ['/api/trade-finance', { userId: currentUserId }],
    queryFn: async () => {
      if (!currentUserId) return [];
      const res = await apiRequest('GET', `/api/trade-finance?userId=${currentUserId}`);
      return res.json();
    },
    enabled: !!currentUserId,
  });

  // Get single application
  const {
    data: application,
    isLoading: isLoadingApplication,
    error: applicationError,
    refetch: refetchApplication,
  } = useQuery({
    queryKey: ['/api/trade-finance', applicationId],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/trade-finance/${applicationId}`);
      return res.json();
    },
    enabled: !!applicationId,
  });

  // Get contract applications
  const {
    data: contractApplications = [],
    isLoading: isLoadingContractApplications,
    error: contractApplicationsError,
    refetch: refetchContractApplications,
  } = useQuery({
    queryKey: ['/api/trade-finance', { contractId }],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/trade-finance?contractId=${contractId}`);
      return res.json();
    },
    enabled: !!contractId,
  });

  // Create application
  const createApplicationMutation = useMutation({
    mutationFn: async (applicationData: {
      userId: number;
      applicationType: string;
      amount: string;
      currency: string;
      contractId?: number;
      expiryDate?: Date;
      terms?: Record<string, any>;
      supportingDocuments?: string[];
    }) => {
      const res = await apiRequest('POST', '/api/trade-finance', applicationData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trade-finance', { userId: currentUserId }] });
      if (contractId) {
        queryClient.invalidateQueries({ queryKey: ['/api/trade-finance', { contractId }] });
      }
      toast({
        title: "Application Submitted",
        description: "Your trade finance application has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Application Submission Failed",
        description: error.message || "There was an error submitting your application.",
        variant: "destructive",
      });
    },
  });

  // Update application
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, applicationData }: { id: number, applicationData: Partial<TradeFinanceApplication> }) => {
      const res = await apiRequest('PATCH', `/api/trade-finance/${id}`, applicationData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trade-finance'] });
      if (applicationId) {
        queryClient.invalidateQueries({ queryKey: ['/api/trade-finance', applicationId] });
      }
      if (contractId) {
        queryClient.invalidateQueries({ queryKey: ['/api/trade-finance', { contractId }] });
      }
      toast({
        title: "Application Updated",
        description: "The trade finance application has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Application Update Failed",
        description: error.message || "There was an error updating the application.",
        variant: "destructive",
      });
    },
  });

  // Update application status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await apiRequest('PATCH', `/api/trade-finance/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trade-finance'] });
      if (applicationId) {
        queryClient.invalidateQueries({ queryKey: ['/api/trade-finance', applicationId] });
      }
      if (contractId) {
        queryClient.invalidateQueries({ queryKey: ['/api/trade-finance', { contractId }] });
      }
      toast({
        title: "Status Updated",
        description: "The application status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Status Update Failed",
        description: error.message || "There was an error updating the application status.",
        variant: "destructive",
      });
    },
  });

  return {
    // Application data
    applications,
    application,
    contractApplications,
    // Loading states
    isLoadingApplications,
    isLoadingApplication,
    isLoadingContractApplications,
    // Errors
    applicationsError,
    applicationError,
    contractApplicationsError,
    // Refetch functions
    refetchApplications,
    refetchApplication,
    refetchContractApplications,
    // Mutations
    createApplicationMutation,
    updateApplicationMutation,
    updateStatusMutation,
  };
};