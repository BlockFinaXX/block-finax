import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { queryClient } from "../lib/queryClient";
import { useWeb3 } from "./useWeb3";
import { useToast } from "./use-toast";

export interface KYCData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationality?: string;
  residenceCountry?: string;
  idType?: string;
  idNumber?: string;
  idExpiryDate?: string;
  taxIdNumber?: string;
  companyName?: string;
  companyRegistrationNumber?: string;
  companyType?: string;
  businessCategory?: string;
  yearEstablished?: number;
  annualRevenue?: number;
  employeeCount?: number;
  businessAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  contactDetails?: {
    email?: string;
    phone?: string;
  };
  documentVerification?: {
    identityDocument?: string;
    proofOfAddress?: string;
    companyRegistration?: string;
    taxCertificate?: string;
  };
  kycLevel?: "BASIC" | "ADVANCED"; // Added this property for KYC level tracking
}

export interface User {
  id: number;
  username: string;
  walletAddress: string | null;
  profileImage: string | null;
  kycStatus: string | null;
  riskScore: number | null;
  kycData: KYCData | null;
}

export enum KYCStatus {
  PENDING = "PENDING",
  BASIC_COMPLETED = "BASIC_COMPLETED",
  ADVANCED_PENDING = "ADVANCED_PENDING",
  ADVANCED_VERIFIED = "ADVANCED_VERIFIED",
  REJECTED = "REJECTED",
}

export const useKYC = (userId?: number) => {
  const { toast } = useToast();
  const { user } = useWeb3();

  // If userId not provided, use the current user's ID
  const currentUserId = userId || (user?.id as number);

  // Get user's KYC data
  const {
    data: kycUser,
    isLoading: isLoadingKYC,
    error: kycError,
    refetch: refetchKYC,
  } = useQuery({
    queryKey: ["/api/users", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return null;
      const res = await apiRequest("GET", `/api/users/${currentUserId}`);
      return res.json();
    },
    enabled: !!currentUserId,
  });

  // Submit KYC data
  const submitKYCMutation = useMutation({
    mutationFn: async (kycData: KYCData) => {
      // Determine the KYC status based on the level
      let kycStatus = KYCStatus.ADVANCED_PENDING; // Default for advanced verification

      if (kycData.kycLevel === "BASIC") {
        kycStatus = KYCStatus.BASIC_COMPLETED;
      }

      const res = await apiRequest("POST", `/api/users/${currentUserId}/kyc`, {
        kycData,
        kycStatus,
      });
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["/api/users", currentUserId],
      });

      // Different messages depending on KYC level
      if (variables.kycLevel === "BASIC") {
        toast({
          title: "Basic Verification Complete",
          description:
            "Your basic verification is complete. You can now access standard platform features.",
        });
      } else {
        toast({
          title: "Advanced Verification Submitted",
          description:
            "Your advanced verification has been submitted and is pending review (1-3 business days).",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "KYC Submission Failed",
        description:
          error.message ||
          "There was an error submitting your KYC information.",
        variant: "destructive",
      });
    },
  });

  // Update KYC status (admin only)
  const updateKYCStatusMutation = useMutation({
    mutationFn: async ({
      userId,
      status,
      riskScore,
    }: {
      userId: number;
      status: KYCStatus;
      riskScore?: number;
    }) => {
      const res = await apiRequest("PATCH", `/api/users/${userId}/kyc/status`, {
        status,
        riskScore,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "KYC Status Updated",
        description: "The KYC status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Status Update Failed",
        description:
          error.message || "There was an error updating the KYC status.",
        variant: "destructive",
      });
    },
  });

  return {
    // KYC data
    kycUser,
    kycStatus: kycUser?.kycStatus || KYCStatus.PENDING,
    riskScore: kycUser?.riskScore || 0,
    kycData: kycUser?.kycData || null,
    // Loading states
    isLoadingKYC,
    // Errors
    kycError,
    // Refetch functions
    refetchKYC,
    // Mutations
    submitKYCMutation,
    updateKYCStatusMutation,
  };
};
