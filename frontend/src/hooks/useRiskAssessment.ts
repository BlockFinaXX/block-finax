import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useWeb3 } from "./useWeb3";
import { useToast } from "./use-toast";

interface RiskFactor {
  name: string;
  level: "low" | "medium" | "high";
  score: number;
  description?: string;
}

interface OverallRisk {
  score: number;
  level: "low" | "medium" | "high";
  trend: "improving" | "stable" | "worsening";
}

interface RiskData {
  overallRisk: OverallRisk;
  riskFactors: RiskFactor[];
  recommendations: string[];
}

interface RiskDashboard {
  totalRisk: number;
  complianceScore: number;
  documentRisk: number;
  counterpartyRisk: number;
  financialRisk: number;
  geographicalRisk: number;
  volumeRisk: number;
  riskTrends: {
    period: string;
    score: number;
  }[];
  riskFactors: {
    factor: string;
    score: number;
    level: "low" | "medium" | "high";
  }[];
  flaggedTransactions: number;
  recommendations: string[];
}

// Mock data generator helper function for initial development
const generateMockRiskDashboard = (contractsData: any[]): RiskDashboard => {
  return {
    totalRisk: 32,
    complianceScore: 87,
    documentRisk: 25,
    counterpartyRisk: 40,
    financialRisk: 15,
    geographicalRisk: 45,
    volumeRisk: 30,
    riskTrends: [
      { period: "Jan", score: 45 },
      { period: "Feb", score: 42 },
      { period: "Mar", score: 38 },
      { period: "Apr", score: 32 },
    ],
    riskFactors: [
      { factor: "Missing trade documentation", score: 65, level: "medium" },
      { factor: "Counterparty concentration", score: 40, level: "low" },
      { factor: "Payment delay patterns", score: 30, level: "low" },
      { factor: "Trade volume anomalies", score: 20, level: "low" },
      { factor: "Geographical exposure", score: 45, level: "medium" },
    ],
    flaggedTransactions: 3,
    recommendations: [
      "Complete missing documentation for contracts #1234 and #5678",
      "Diversify counterparty exposure with ABC Corp",
      "Review and update trade finance terms for better payment compliance",
    ],
  };
};

// Transformed data to match the expected format in the dashboard
const transformToRiskData = (dashboard: RiskDashboard): RiskData => {
  // Map risk level based on score
  const getRiskLevel = (score: number): "low" | "medium" | "high" => {
    if (score < 30) return "low";
    if (score < 70) return "medium";
    return "high";
  };

  return {
    overallRisk: {
      score: dashboard.totalRisk,
      level: getRiskLevel(dashboard.totalRisk),
      trend:
        dashboard.riskTrends[dashboard.riskTrends.length - 2].score >
        dashboard.riskTrends[dashboard.riskTrends.length - 1].score
          ? "improving"
          : "worsening",
    },
    riskFactors: dashboard.riskFactors.map((factor) => ({
      name: factor.factor,
      level: factor.level,
      score: factor.score,
    })),
    recommendations: dashboard.recommendations,
  };
};

export const useRiskAssessment = () => {
  const { toast } = useToast();
  const { user } = useWeb3();

  // Get risk dashboard data
  const { data: riskDashboard, isLoading: isLoadingRiskDashboard } = useQuery({
    queryKey: ["/api/risk/dashboard"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/risk/dashboard");
        return await res.json();
      } catch (error) {
        // In development, return mock data
        console.warn("Using mock risk dashboard data for development");
        return generateMockRiskDashboard([]);
      }
    },
  });

  // Generate risk insights
  const { mutateAsync: generateInsights, isPending: isGeneratingInsights } =
    useMutation({
      mutationFn: async (options?: any) => {
        try {
          const res = await apiRequest(
            "POST",
            "/api/risk/insights/generate",
            options
          );
          await res.json();
          toast({
            title: "Risk Insights Generated",
            description: "New risk insights are now available.",
          });
          return true;
        } catch (error: any) {
          toast({
            title: "Failed to Generate Insights",
            description:
              error?.message || "There was an error generating risk insights.",
            variant: "destructive",
          });
          return false;
        }
      },
    });

  // Transform the dashboard data
  const riskData = riskDashboard ? transformToRiskData(riskDashboard) : null;

  return {
    riskDashboard,
    riskData,
    isLoading: isLoadingRiskDashboard,
    generateInsights,
    isGeneratingInsights,
  };
};
