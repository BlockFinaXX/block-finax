import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Gauge,
  TrendingUp,
  Globe,
  Users,
  AlertTriangle,
  LineChart,
  Shield,
  CreditCard,
  Truck,
  FileText,
  DollarSign,
  Landmark,
  BarChart3,
  RefreshCcw,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Lightbulb,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useRiskAssessment } from "@/hooks/useRiskAssessment";
import { useWeb3 } from "@/hooks/useWeb3";
import {
  RiskLevel,
  RiskCategory,
  RiskFactor,
  CountryRisk,
  PartnerRisk,
  RiskInsight,
  RiskTrend,
  getRiskLevelColor,
  getRiskCategoryIcon,
} from "@/types/risk";
import RiskOverview from "./RiskOverview";
import RiskInsightsList from "./RiskInsightsList";
import RiskTrendsChart from "./RiskTrendsChart";
import RiskPredictions from "./RiskPredictions";
import RiskFactorList from "./RiskFactorList";
import CountryRiskMap from "./CountryRiskMap";
import PartnerRiskTable from "./PartnerRiskTable";

const RiskDashboard: React.FC = () => {
  const {
    riskDashboard,
    isLoadingRiskDashboard,
    generateInsights,
    isGeneratingInsights,
  } = useRiskAssessment();
  const { user } = useWeb3();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showSidebar, setShowSidebar] = useState(true);

  if (isLoadingRiskDashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-primary mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-500">Loading risk assessment data...</p>
        </div>
      </div>
    );
  }

  // If no risk data yet, we can show a placeholder
  if (!riskDashboard) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-primary">
            Trade Risk Intelligence
          </h1>
          <Button
            onClick={() => generateInsights({})}
            disabled={isGeneratingInsights}
          >
            {isGeneratingInsights ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Generate Risk Insights
              </>
            )}
          </Button>
        </div>

        <Card className="bg-gradient-to-r from-slate-50 to-slate-100 shadow-md">
          <CardHeader>
            <CardTitle>Trade Risk Intelligence</CardTitle>
            <CardDescription>
              Get AI-powered insights into your trade risks and opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Gauge className="h-16 w-16 text-primary/50 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Risk Assessment Data Yet
            </h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              Generate your first risk assessment to get personalized insights
              into your trade portfolio's risk factors, trends, and predictions.
            </p>
            <Button
              onClick={() => generateInsights({})}
              disabled={isGeneratingInsights}
              size="lg"
              className="mt-2"
            >
              {isGeneratingInsights ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating Risk Assessment...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Generate Risk Assessment
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main dashboard with risk data
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-primary">
          Trade Risk Intelligence
        </h1>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500">
            Last updated:{" "}
            {new Date(riskDashboard.lastUpdated).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateInsights({})}
            disabled={isGeneratingInsights}
          >
            {isGeneratingInsights ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh Insights
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
            title={showSidebar ? "Hide sidebar" : "Show sidebar"}
          >
            {showSidebar ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Main content area */}
        <div
          className={`${
            showSidebar ? "w-3/4" : "w-full"
          } space-y-4 transition-all duration-200`}
        >
          {/* Risk score header cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="overflow-hidden border-none shadow-md">
              <div
                className={`bg-gradient-to-r p-6 text-white ${
                  riskDashboard.riskLevel === RiskLevel.LOW
                    ? "from-green-600 to-green-500"
                    : riskDashboard.riskLevel === RiskLevel.MEDIUM
                    ? "from-yellow-600 to-yellow-500"
                    : riskDashboard.riskLevel === RiskLevel.HIGH
                    ? "from-orange-600 to-orange-500"
                    : "from-red-600 to-red-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      Overall Risk Score
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-white">
                      {riskDashboard.overallRiskScore.toFixed(1)}
                    </h3>
                  </div>
                  <Gauge className="h-8 w-8 text-white/90" />
                </div>
                <div className="mt-4">
                  <Progress
                    value={riskDashboard.overallRiskScore}
                    className="h-2 bg-white/20"
                  />
                </div>
                <div className="mt-4 flex items-center text-sm text-white/80">
                  <Badge
                    variant="outline"
                    className="border-white/30 text-white font-medium"
                  >
                    {riskDashboard.riskLevel}
                  </Badge>
                  <span className="ml-2">Risk Level</span>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border-none shadow-md">
              <div className="bg-gradient-to-r from-primary to-primary/90 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      Insight Count
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-white">
                      {riskDashboard.insights.length}
                    </h3>
                  </div>
                  <Lightbulb className="h-8 w-8 text-white/90" />
                </div>
                <div className="mt-4 flex items-center">
                  <div className="flex -space-x-2">
                    {Object.values(RiskCategory)
                      .slice(0, 4)
                      .map((category, index) => (
                        <div
                          key={category}
                          className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs text-white ring-2 ring-primary"
                          style={{ zIndex: 10 - index }}
                        >
                          {category.charAt(0)}
                        </div>
                      ))}
                  </div>
                  <span className="ml-4 text-sm text-white/80">
                    Across {Object.values(RiskCategory).length} risk categories
                  </span>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border-none shadow-md">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      Monitored Countries
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-white">
                      {riskDashboard.countryRisks.length}
                    </h3>
                  </div>
                  <Globe className="h-8 w-8 text-white/90" />
                </div>
                <div className="mt-4 flex items-center text-sm text-white/80">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-300 mr-1"></div>
                      <span>
                        Low:{" "}
                        {
                          riskDashboard.countryRisks.filter(
                            (c) => c.riskLevel === RiskLevel.LOW
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-300 mr-1"></div>
                      <span>
                        Med:{" "}
                        {
                          riskDashboard.countryRisks.filter(
                            (c) => c.riskLevel === RiskLevel.MEDIUM
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-300 mr-1"></div>
                      <span>
                        High:{" "}
                        {
                          riskDashboard.countryRisks.filter(
                            (c) =>
                              c.riskLevel === RiskLevel.HIGH ||
                              c.riskLevel === RiskLevel.CRITICAL
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main tabs for different risk sections */}
          <Tabs
            defaultValue="overview"
            value={selectedTab}
            onValueChange={setSelectedTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="overview" className="flex items-center">
                <Gauge className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center">
                <Lightbulb className="mr-2 h-4 w-4" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="predictions" className="flex items-center">
                <LineChart className="mr-2 h-4 w-4" />
                Predictions
              </TabsTrigger>
              <TabsTrigger value="factors" className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Risk Factors
              </TabsTrigger>
              <TabsTrigger value="geoRisk" className="flex items-center">
                <Globe className="mr-2 h-4 w-4" />
                Geo Risk
              </TabsTrigger>
              <TabsTrigger value="partners" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Partners
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <RiskOverview riskDashboard={riskDashboard} />
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <RiskInsightsList insights={riskDashboard.insights} />
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <RiskTrendsChart trends={riskDashboard.trends} />
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4">
              <RiskPredictions predictions={riskDashboard.predictions} />
            </TabsContent>

            <TabsContent value="factors" className="space-y-4">
              <RiskFactorList riskFactors={riskDashboard.riskFactors} />
            </TabsContent>

            <TabsContent value="geoRisk" className="space-y-4">
              <CountryRiskMap countryRisks={riskDashboard.countryRisks} />
            </TabsContent>

            <TabsContent value="partners" className="space-y-4">
              <PartnerRiskTable partnerRisks={riskDashboard.partnerRisks} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar with key insights and alerts */}
        {showSidebar && (
          <div className="w-1/4 space-y-4">
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Critical Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {riskDashboard.insights
                  .filter(
                    (insight) =>
                      insight.riskLevel === RiskLevel.CRITICAL ||
                      insight.riskLevel === RiskLevel.HIGH
                  )
                  .slice(0, 4)
                  .map((insight) => (
                    <Alert
                      key={insight.id}
                      className={`bg-${
                        insight.riskLevel === RiskLevel.CRITICAL
                          ? "red"
                          : "orange"
                      }-50 border-${
                        insight.riskLevel === RiskLevel.CRITICAL
                          ? "red"
                          : "orange"
                      }-200`}
                    >
                      <AlertTriangle
                        className={`h-4 w-4 text-${
                          insight.riskLevel === RiskLevel.CRITICAL
                            ? "red"
                            : "orange"
                        }-500`}
                      />
                      <AlertTitle className="text-sm font-medium">
                        {insight.title}
                      </AlertTitle>
                      <AlertDescription className="text-xs mt-1">
                        {insight.description.substring(0, 100)}...
                      </AlertDescription>
                    </Alert>
                  ))}

                {riskDashboard.insights.filter(
                  (insight) =>
                    insight.riskLevel === RiskLevel.CRITICAL ||
                    insight.riskLevel === RiskLevel.HIGH
                ).length === 0 && (
                  <div className="py-4 text-center text-sm text-gray-500">
                    <Shield className="mx-auto h-8 w-8 text-green-500 mb-2" />
                    <p>No critical alerts at this time</p>
                  </div>
                )}
              </CardContent>
              {riskDashboard.insights.filter(
                (insight) =>
                  insight.riskLevel === RiskLevel.CRITICAL ||
                  insight.riskLevel === RiskLevel.HIGH
              ).length > 4 && (
                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    className="w-full text-xs flex items-center justify-center text-primary"
                    onClick={() => setSelectedTab("insights")}
                  >
                    View all alerts
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardFooter>
              )}
            </Card>

            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Risk by Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.values(RiskCategory)
                  .slice(0, 5)
                  .map((category) => {
                    const categoryFactors = riskDashboard.riskFactors.filter(
                      (factor) => factor.category === category
                    );
                    const avgRisk = categoryFactors.length
                      ? categoryFactors.reduce(
                          (sum, factor) => sum + factor.value,
                          0
                        ) / categoryFactors.length
                      : 0;

                    let level = RiskLevel.LOW;
                    if (avgRisk > 75) level = RiskLevel.CRITICAL;
                    else if (avgRisk > 50) level = RiskLevel.HIGH;
                    else if (avgRisk > 25) level = RiskLevel.MEDIUM;

                    const levelColor =
                      level === RiskLevel.LOW
                        ? "green"
                        : level === RiskLevel.MEDIUM
                        ? "yellow"
                        : level === RiskLevel.HIGH
                        ? "orange"
                        : "red";

                    // Get the appropriate icon component
                    let IconComponent;
                    switch (category) {
                      case RiskCategory.CREDIT:
                        IconComponent = CreditCard;
                        break;
                      case RiskCategory.COUNTRY:
                        IconComponent = Globe;
                        break;
                      case RiskCategory.CURRENCY:
                        IconComponent = DollarSign;
                        break;
                      case RiskCategory.DELIVERY:
                        IconComponent = Truck;
                        break;
                      case RiskCategory.PAYMENT:
                        IconComponent = Landmark;
                        break;
                      case RiskCategory.DOCUMENTATION:
                        IconComponent = FileText;
                        break;
                      case RiskCategory.REGULATORY:
                        IconComponent = Shield;
                        break;
                      case RiskCategory.FRAUD:
                        IconComponent = AlertTriangle;
                        break;
                      default:
                        IconComponent = AlertTriangle;
                    }

                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <IconComponent
                              className={`h-4 w-4 text-${levelColor}-500 mr-2`}
                            />
                            <span className="text-sm">{category}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs bg-${levelColor}-50 text-${levelColor}-700 border-${levelColor}-200`}
                          >
                            {level}
                          </Badge>
                        </div>
                        <Progress
                          value={avgRisk}
                          className="h-1.5"
                          indicatorClassName={`bg-${levelColor}-500`}
                        />
                      </div>
                    );
                  })}
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="ghost"
                  className="w-full text-xs flex items-center justify-center text-primary"
                  onClick={() => setSelectedTab("factors")}
                >
                  View all categories
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Changes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {riskDashboard.riskFactors
                  .filter((factor) => factor.trend !== "stable")
                  .slice(0, 4)
                  .map((factor) => (
                    <div
                      key={factor.id}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className={`
                        p-1.5 rounded-full 
                        ${
                          factor.trend === "increasing"
                            ? "bg-red-50 text-red-500"
                            : "bg-green-50 text-green-500"
                        }
                      `}
                      >
                        <TrendingUp className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900">
                          {factor.category}
                        </p>
                        <p className="text-xs text-gray-500">
                          {factor.description.substring(0, 60)}...
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          factor.trend === "increasing"
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-green-50 text-green-600 border-green-200"
                        }`}
                      >
                        {factor.trend === "increasing" ? "↑" : "↓"}
                      </Badge>
                    </div>
                  ))}

                {riskDashboard.riskFactors.filter(
                  (factor) => factor.trend !== "stable"
                ).length === 0 && (
                  <div className="py-4 text-center text-sm text-gray-500">
                    <BarChart3 className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p>No significant changes detected</p>
                  </div>
                )}
              </CardContent>
              {riskDashboard.riskFactors.filter(
                (factor) => factor.trend !== "stable"
              ).length > 4 && (
                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    className="w-full text-xs flex items-center justify-center text-primary"
                    onClick={() => setSelectedTab("trends")}
                  >
                    View all changes
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskDashboard;
