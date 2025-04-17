import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Gauge,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  ArrowUpRight,
  List,
  Map,
  PieChart,
  BarChart2,
} from 'lucide-react';
import { RiskDashboard, RiskLevel, RiskCategory } from '@/types/risk';

interface RiskOverviewProps {
  riskDashboard: RiskDashboard;
}

const RiskOverview: React.FC<RiskOverviewProps> = ({ riskDashboard }) => {
  // Function to get appropriate color based on risk level
  const getRiskLevelColor = (level: RiskLevel): string => {
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

  // Get most critical risk factors (top 2)
  const criticalRiskFactors = [...riskDashboard.riskFactors]
    .sort((a, b) => b.value - a.value)
    .slice(0, 2);

  // Get latest insights (top 3)
  const latestInsights = [...riskDashboard.insights]
    .sort((a, b) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime())
    .slice(0, 3);

  // Calculate risk category breakdown
  const riskCategoryBreakdown = Object.values(RiskCategory).map(category => {
    const categoryFactors = riskDashboard.riskFactors.filter(
      factor => factor.category === category
    );
    const avgValue = categoryFactors.length
      ? categoryFactors.reduce((sum, factor) => sum + factor.value, 0) / categoryFactors.length
      : 0;
    return {
      category,
      value: avgValue,
      count: categoryFactors.length
    };
  }).sort((a, b) => b.value - a.value);

  // Get predictions with highest impact
  const highImpactPredictions = [...riskDashboard.predictions]
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 2);

  // Get country with highest risk
  const highestRiskCountry = [...riskDashboard.countryRisks]
    .sort((a, b) => b.overallRiskScore - a.overallRiskScore)[0];

  // Get partner with highest risk
  const highestRiskPartner = [...riskDashboard.partnerRisks]
    .sort((a, b) => (100 - b.creditScore) - (100 - a.creditScore))[0];

  return (
    <div className="space-y-4">
      {/* Top risk indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Critical risk factors card */}
        <Card className="shadow-md overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              Key Risk Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {criticalRiskFactors.map(factor => {
              const color = getRiskLevelColor(factor.level);
              return (
                <div key={factor.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Badge 
                        className={`mr-2 bg-${color}-100 text-${color}-800 border-${color}-200`}
                      >
                        {factor.category}
                      </Badge>
                      <span className="text-sm font-medium">{factor.description}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs bg-${color}-50 text-${color}-700 border-${color}-200`}
                    >
                      {factor.level}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center">
                    <Progress 
                      value={factor.value} 
                      className="flex-1 h-2"
                      indicatorClassName={`bg-${color}-500`}
                    />
                    <span className="ml-2 text-sm text-gray-500">
                      {factor.value.toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <span className={`flex items-center mr-3 ${
                      factor.trend === 'increasing' 
                        ? 'text-red-500' 
                        : factor.trend === 'decreasing' 
                        ? 'text-green-500' 
                        : ''
                    }`}>
                      {factor.trend === 'increasing' ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : factor.trend === 'decreasing' ? (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      ) : null}
                      {factor.trend.charAt(0).toUpperCase() + factor.trend.slice(1)}
                    </span>
                    <span>{factor.impactDescription}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Latest insights card */}
        <Card className="shadow-md overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Info className="h-5 w-5 text-primary mr-2" />
              AI-Powered Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestInsights.map(insight => {
              const color = getRiskLevelColor(insight.riskLevel);
              return (
                <Alert key={insight.id} className={`bg-${color}-50 border-${color}-200 py-3`}>
                  <div className="flex items-start">
                    <AlertTriangle className={`h-4 w-4 text-${color}-500 mt-0.5 mr-2 flex-shrink-0`} />
                    <div>
                      <AlertTitle className="text-sm font-medium">{insight.title}</AlertTitle>
                      <AlertDescription className="text-xs mt-1">
                        {insight.description.substring(0, 120)}...
                        <div className="mt-1 flex justify-between items-center">
                          <Badge 
                            variant="outline" 
                            className={`text-xs bg-${color}-50 text-${color}-700 border-${color}-200`}
                          >
                            {insight.relatedCategory}
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
                            View Details <ArrowUpRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              );
            })}
          </CardContent>
        </Card>
      </div>
      
      {/* Risk metrics and visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Risk breakdown */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <PieChart className="h-4 w-4 text-primary mr-2" />
              Risk Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {riskCategoryBreakdown.slice(0, 5).map(({ category, value, count }) => {
                let color;
                if (value > 75) color = 'red';
                else if (value > 50) color = 'orange';
                else if (value > 25) color = 'yellow';
                else color = 'green';
                
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{category}</span>
                      <span className="text-sm font-medium">{value.toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={value} 
                      className="h-1.5"
                      indicatorClassName={`bg-${color}-500`}
                    />
                  </div>
                );
              })}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-3 text-xs"
            >
              View All Categories <List className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Geo risk highlight */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Map className="h-4 w-4 text-primary mr-2" />
              Geographical Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            {highestRiskCountry && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-semibold">{highestRiskCountry.country}</div>
                    <div className="text-sm text-gray-500">Highest Risk Region</div>
                  </div>
                  <Badge 
                    className={`bg-${getRiskLevelColor(highestRiskCountry.riskLevel)}-100 text-${getRiskLevelColor(highestRiskCountry.riskLevel)}-800`}
                  >
                    {highestRiskCountry.riskLevel}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500">Political Stability</div>
                    <div className="font-medium">{highestRiskCountry.politicalStabilityScore}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Economic Stability</div>
                    <div className="font-medium">{highestRiskCountry.economicStabilityScore}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Regulatory Quality</div>
                    <div className="font-medium">{highestRiskCountry.regulatoryQualityScore}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Trading Partners</div>
                    <div className="font-medium">{highestRiskCountry.tradingPartnerCount}</div>
                  </div>
                </div>
                
                {highestRiskCountry.tradeRestrictions.length > 0 && (
                  <div className="text-xs text-red-600">
                    <AlertTriangle className="inline h-3 w-3 mr-1" />
                    {highestRiskCountry.tradeRestrictions[0]}
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-1 text-xs"
                >
                  View Country Analysis <Map className="ml-1 h-3 w-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Partner risk highlight */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <BarChart2 className="h-4 w-4 text-primary mr-2" />
              Partner Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            {highestRiskPartner && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-semibold">{highestRiskPartner.partnerName}</div>
                    <div className="text-sm text-gray-500">{highestRiskPartner.country}</div>
                  </div>
                  <Badge 
                    className={`bg-${getRiskLevelColor(highestRiskPartner.riskLevel)}-100 text-${getRiskLevelColor(highestRiskPartner.riskLevel)}-800`}
                  >
                    {highestRiskPartner.riskLevel}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Credit Score</span>
                    <span className="font-medium">{highestRiskPartner.creditScore}%</span>
                  </div>
                  <Progress 
                    value={highestRiskPartner.creditScore} 
                    className="h-1.5"
                    indicatorClassName={`${
                      highestRiskPartner.creditScore > 75 
                        ? 'bg-green-500' 
                        : highestRiskPartner.creditScore > 50 
                        ? 'bg-yellow-500' 
                        : highestRiskPartner.creditScore > 25 
                        ? 'bg-orange-500' 
                        : 'bg-red-500'
                    }`}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500">On-time</div>
                    <div className="font-medium text-green-600">
                      {highestRiskPartner.paymentHistory.onTimePayments}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Late</div>
                    <div className="font-medium text-yellow-600">
                      {highestRiskPartner.paymentHistory.latePayments}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Missed</div>
                    <div className="font-medium text-red-600">
                      {highestRiskPartner.paymentHistory.missedPayments}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="text-gray-500">Trade Volume</div>
                    <div className="font-medium">${highestRiskPartner.totalTradeVolume.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Relationship</div>
                    <div className="font-medium">{highestRiskPartner.relationshipYears} years</div>
                  </div>
                </div>
                
                {highestRiskPartner.recentFlags.length > 0 && (
                  <div className="text-xs text-red-600">
                    <AlertTriangle className="inline h-3 w-3 mr-1" />
                    {highestRiskPartner.recentFlags[0]}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Predictions section */}
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Gauge className="h-5 w-5 text-primary mr-2" />
            Predictive Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highImpactPredictions.map(prediction => {
              const riskScore = prediction.probability * prediction.impact;
              const color = riskScore > 7 ? 'red' : riskScore > 5 ? 'orange' : riskScore > 3 ? 'yellow' : 'green';
              
              return (
                <div key={prediction.category} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Badge 
                        className={`mb-1 bg-${color}-100 text-${color}-800 border-${color}-200`}
                      >
                        {prediction.category}
                      </Badge>
                      <h4 className="font-medium">
                        {prediction.factors[0]}
                      </h4>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Risk Score</div>
                      <div className={`font-bold text-${color}-600`}>
                        {riskScore.toFixed(1)}/10
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center text-sm mt-4">
                    <div>
                      <div className="text-gray-500">Probability</div>
                      <div className="font-medium">{(prediction.probability * 100).toFixed(0)}%</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Impact</div>
                      <div className="font-medium">{prediction.impact.toFixed(1)}/10</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Confidence</div>
                      <div className="font-medium">{(prediction.confidence * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <div className="text-gray-500">Potential Loss</div>
                    <div className="font-medium text-red-600">${prediction.potentialLoss.toLocaleString()}</div>
                  </div>
                  
                  {prediction.mitigationOptions.length > 0 && (
                    <div className="mt-3 text-sm">
                      <div className="text-gray-500 mb-1">Recommended Action</div>
                      <div className="font-medium text-primary">
                        {prediction.mitigationOptions[0].strategy}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
          >
            View All Predictions and Recommendations
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskOverview;