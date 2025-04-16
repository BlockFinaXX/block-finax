import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useWeb3 } from "@/hooks/useWeb3";
import { useToast } from "@/hooks/use-toast";

interface Wallet {
  id: number;
  userId: number;
  walletType: string;
  contractId: number | null;
  balance: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Transaction {
  id: number;
  fromWalletId: number | null;
  toWalletId: number | null;
  amount: string;
  currency: string;
  txType: string;
  status: string;
  contractId: number | null;
  description: string | null;
  createdAt: Date;
  metadata: Record<string, any> | null;
}

export const useWallet = (userId?: number, walletId?: number) => {
  const { toast } = useToast();
  const { user } = useWeb3();

  // If userId not provided, use the current user's ID
  const currentUserId = userId || (user?.id as number);

  // Get user's wallets
  const {
    data: wallets = [],
    isLoading: isLoadingWallets,
    error: walletsError,
    refetch: refetchWallets,
  } = useQuery({
    queryKey: ["/api/users", currentUserId, "wallets"],
    queryFn: async () => {
      if (!currentUserId) return [];
      const res = await apiRequest(
        "GET",
        `/api/users/${currentUserId}/wallets`
      );
      return res.json();
    },
    enabled: !!currentUserId,
  });

  // Get single wallet
  const {
    data: wallet,
    isLoading: isLoadingWallet,
    error: walletError,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: ["/api/wallets", walletId],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/wallets/${walletId}`);
      return res.json();
    },
    enabled: !!walletId,
  });

  // Get transactions for a wallet
  const {
    data: transactions = [],
    isLoading: isLoadingTransactions,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["/api/wallets", walletId, "transactions"],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/wallets/${walletId}/transactions`
      );
      return res.json();
    },
    enabled: !!walletId,
  });

  // Get all user transactions
  const {
    data: userTransactions = [],
    isLoading: isLoadingUserTransactions,
    error: userTransactionsError,
    refetch: refetchUserTransactions,
  } = useQuery({
    queryKey: ["/api/users", currentUserId, "transactions"],
    queryFn: async () => {
      if (!currentUserId) return [];
      const res = await apiRequest(
        "GET",
        `/api/users/${currentUserId}/transactions`
      );
      return res.json();
    },
    enabled: !!currentUserId,
  });

  // Deposit to wallet
  const depositMutation = useMutation({
    mutationFn: async ({
      walletId,
      amount,
      currency,
    }: {
      walletId: number;
      amount: string;
      currency?: string;
    }) => {
      const res = await apiRequest("POST", `/api/wallets/${walletId}/deposit`, {
        amount,
        currency,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/users", currentUserId, "wallets"],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wallets", walletId] });
      queryClient.invalidateQueries({
        queryKey: ["/api/wallets", walletId, "transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/users", currentUserId, "transactions"],
      });
      toast({
        title: "Deposit Successful",
        description: "Funds have been added to your wallet.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Deposit Failed",
        description:
          error.message || "There was an error processing your deposit.",
        variant: "destructive",
      });
    },
  });

  // Withdraw from wallet
  const withdrawMutation = useMutation({
    mutationFn: async ({
      walletId,
      amount,
      currency,
    }: {
      walletId: number;
      amount: string;
      currency?: string;
    }) => {
      const res = await apiRequest(
        "POST",
        `/api/wallets/${walletId}/withdraw`,
        { amount, currency }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/users", currentUserId, "wallets"],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wallets", walletId] });
      queryClient.invalidateQueries({
        queryKey: ["/api/wallets", walletId, "transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/users", currentUserId, "transactions"],
      });
      toast({
        title: "Withdrawal Successful",
        description: "Funds have been withdrawn from your wallet.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Withdrawal Failed",
        description:
          error.message || "There was an error processing your withdrawal.",
        variant: "destructive",
      });
    },
  });

  // Transfer between wallets
  const transferMutation = useMutation({
    mutationFn: async ({
      fromWalletId,
      toWalletId,
      amount,
      currency,
      description,
    }: {
      fromWalletId: number;
      toWalletId: number;
      amount: string;
      currency?: string;
      description?: string;
    }) => {
      const res = await apiRequest(
        "POST",
        `/api/wallets/${fromWalletId}/transfer/${toWalletId}`,
        { amount, currency, description }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/users", currentUserId, "wallets"],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/users", currentUserId, "transactions"],
      });
      toast({
        title: "Transfer Successful",
        description: "Funds have been transferred successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Transfer Failed",
        description:
          error.message || "There was an error processing your transfer.",
        variant: "destructive",
      });
    },
  });

  // Fund escrow for a contract
  const fundEscrowMutation = useMutation({
    mutationFn: async ({
      contractId,
      fromWalletId,
    }: {
      contractId: number;
      fromWalletId: number;
    }) => {
      const res = await apiRequest(
        "POST",
        `/api/contracts/${contractId}/fund`,
        { fromWalletId }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/users", currentUserId, "wallets"],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/users", currentUserId, "transactions"],
      });
      toast({
        title: "Escrow Funded",
        description: "Contract escrow has been funded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Escrow Funding Failed",
        description: error.message || "There was an error funding the escrow.",
        variant: "destructive",
      });
    },
  });

  // Release escrow funds
  const releaseEscrowMutation = useMutation({
    mutationFn: async ({
      contractId,
      toWalletId,
      type,
    }: {
      contractId: number;
      toWalletId: number;
      type: "seller" | "buyer";
    }) => {
      const res = await apiRequest(
        "POST",
        `/api/contracts/${contractId}/release`,
        { toWalletId, type }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/users", currentUserId, "wallets"],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/users", currentUserId, "transactions"],
      });
      toast({
        title: "Escrow Released",
        description: "Funds have been released from escrow.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Escrow Release Failed",
        description:
          error.message || "There was an error releasing the escrow funds.",
        variant: "destructive",
      });
    },
  });

  return {
    // Wallet data
    wallets,
    wallet,
    transactions,
    userTransactions,
    // Loading states
    isLoadingWallets,
    isLoadingWallet,
    isLoadingTransactions,
    isLoadingUserTransactions,
    // Errors
    walletsError,
    walletError,
    transactionsError,
    userTransactionsError,
    // Refetch functions
    refetchWallets,
    refetchWallet,
    refetchTransactions,
    refetchUserTransactions,
    // Mutations
    depositMutation,
    withdrawMutation,
    transferMutation,
    fundEscrowMutation,
    releaseEscrowMutation,
  };
};
