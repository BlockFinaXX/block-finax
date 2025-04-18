import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { EscrowContract } from "../types/contract";
import { useToast } from "@/hooks/use-toast";

const fetchContracts = async () => {
  const response = await apiRequest("GET", "/api/contracts");
  return response.json();
};

const fetchContractById = async (id: number) => {
  const response = await apiRequest("GET", `/api/contracts/${id}`);
  return response.json();
};
export const useContracts = (contractId?: number) => {
  const { toast } = useToast();

  // Get all contracts
  const {
    data: contracts = [],
    isLoading: isLoadingContracts,
    error: contractsError,
    refetch: refetchContracts,
  } = useQuery({
    queryKey: ["/api/contracts"],
    queryFn: fetchContracts,
    enabled: !contractId,
  });

  // Get specific contract
  const {
    data: contract,
    isLoading: isLoadingContract,
    error: contractError,
    refetch: refetchContract,
  } = useQuery({
    queryKey: ["/api/contracts", contractId],
    queryFn: () => fetchContractById(contractId!),
    enabled: !!contractId,
  });

  // Create contract
  const createContractMutation = useMutation({
    mutationFn: async (contractData: Partial<EscrowContract>) => {
      const response = await apiRequest("POST", "/api/contracts", contractData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      toast({
        title: "Contract Created",
        description: "Your contract has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Contract Creation Failed",
        description: error.message || "Failed to create contract",
        variant: "destructive",
      });
    },
  });

  // Update contract
  const updateContractMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<EscrowContract>;
    }) => {
      const response = await apiRequest("PATCH", `/api/contracts/${id}`, data);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/contracts", variables.id],
      });
      toast({
        title: "Contract Updated",
        description: "Your contract has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Contract Update Failed",
        description: error.message || "Failed to update contract",
        variant: "destructive",
      });
    },
  });

  return {
    contracts,
    contract,
    isLoadingContracts,
    isLoadingContract,
    contractsError,
    contractError,
    createContract: createContractMutation.mutate,
    isCreatingContract: createContractMutation.isPending,
    updateContract: updateContractMutation.mutate,
    isUpdatingContract: updateContractMutation.isPending,
    refetchContracts,
    refetchContract,
  };
};
