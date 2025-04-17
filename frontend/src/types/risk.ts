// Risk level enum
export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}

// Risk category enum
export enum RiskCategory {
  CREDIT = "CREDIT",
  COUNTRY = "COUNTRY",
  CURRENCY = "CURRENCY",
  DELIVERY = "DELIVERY",
  PAYMENT = "PAYMENT",
  DOCUMENTATION = "DOCUMENTATION",
  REGULATORY = "REGULATORY",
  FRAUD = "FRAUD"
}

// Main risk dashboard interface
export interface RiskDashboard {
  lastUpdated: string;
  overallRiskScore: number;
  riskLevel: RiskLevel;
  insights: RiskInsight[];
  riskFactors: RiskFactor[];
  countryRisks: CountryRisk[];
  partnerRisks: PartnerRisk[];
  trends: RiskTrend[];
  predictions: RiskPrediction[];
}

// Risk insight interface
export interface RiskInsight {
  id: string;
  title: string;
  description: string;
  relatedCategory: RiskCategory;
  riskLevel: RiskLevel;
  source: string;
  expiresAt: string;
  relatedContractIds?: number[];
  relatedEntityIds?: number[];
}

// Risk factor interface
export interface RiskFactor {
  id: string;
  category: RiskCategory;
  description: string;
  value: number;
  level: RiskLevel;
  trend: 'increasing' | 'decreasing' | 'stable';
  impactDescription: string;
  mitigationSuggestions?: string[];
}

// Country risk interface
export interface CountryRisk {
  country: string;
  iso: string;
  overallRiskScore: number;
  riskLevel: RiskLevel;
  politicalStabilityScore: number;
  economicStabilityScore: number;
  regulatoryQualityScore: number;
  tradeRestrictions: string[];
  tradingPartnerCount: number;
}

// Partner risk interface
export interface PartnerRisk {
  partnerId: number;
  partnerName: string;
  country: string;
  creditScore: number;
  riskLevel: RiskLevel;
  paymentHistory: {
    onTimePayments: number;
    latePayments: number;
    missedPayments: number;
  };
  relationshipYears: number;
  totalTradeVolume: number;
  avgTransactionSize: number;
  recentFlags: string[];
}

// Risk trend value point
interface RiskTrendValuePoint {
  date: string;
  value: number;
}

// Risk trend forecast point
interface RiskTrendForecastPoint {
  date: string;
  value: number;
  confidence: number;
}

// Risk trend interface
export interface RiskTrend {
  category: RiskCategory;
  description: string;
  values: RiskTrendValuePoint[];
  forecast: RiskTrendForecastPoint[];
}

// Risk prediction mitigation option
interface RiskMitigationOption {
  strategy: string;
  effectivenessScore: number;
  costToImplement: 'low' | 'medium' | 'high';
  timeToImplement: string;
}

// Risk prediction interface
export interface RiskPrediction {
  category: RiskCategory;
  factors: string[];
  probability: number;
  impact: number;
  confidence: number;
  timeframe: 'short' | 'medium' | 'long';
  potentialLoss: number;
  mitigationOptions: RiskMitigationOption[];
}

// Helper function to get risk level color
export const getRiskLevelColor = (level: RiskLevel): string => {
  switch (level) {
    case RiskLevel.LOW:
      return 'green';
    case RiskLevel.MEDIUM:
      return 'yellow';
    case RiskLevel.HIGH:
      return 'orange';
    case RiskLevel.CRITICAL:
      return 'red';
    default:
      return 'gray';
  }
};

// Helper function to get risk category icon component name
export const getRiskCategoryIcon = (category: RiskCategory): string => {
  switch (category) {
    case RiskCategory.CREDIT:
      return 'CreditCard';
    case RiskCategory.COUNTRY:
      return 'Globe';
    case RiskCategory.CURRENCY:
      return 'DollarSign';
    case RiskCategory.DELIVERY:
      return 'Truck';
    case RiskCategory.PAYMENT:
      return 'Landmark';
    case RiskCategory.DOCUMENTATION:
      return 'FileText';
    case RiskCategory.REGULATORY:
      return 'Shield';
    case RiskCategory.FRAUD:
      return 'AlertTriangle';
    default:
      return 'AlertTriangle';
  }
};