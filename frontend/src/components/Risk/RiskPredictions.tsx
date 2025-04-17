import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  BarChart,
  TrendingUp,
  ShieldCheck,
  FileCheck,
  ArrowRight,
  LineChart,
  Lightbulb,
  Download,
  Gauge,
  Table
} from 'lucide-react';
import { RiskPrediction, RiskCategory } from '@/types/risk';

interface RiskPredictionsProps {
  predictions: RiskPrediction[];
}

const RiskPredictions: React.FC<RiskPredictionsProps> = ({ predictions }) => {
  const [timeframeFilter, setTimeframeFilter] = useState<string>('all'); // 'all', 'short', 'medium', 'long'
  const [categoryFilter, setCategoryFilter] = useState<RiskCategory | 'all'>('all');
  const [view, setView] = useState<'cards' | 'table'>('cards');
  
  // Filter predictions based on current filters
  const filteredPredictions = predictions.filter(prediction => {
    if (timeframeFilter !== 'all' && prediction.timeframe !== timeframeFilter) {
      return false;
    }
    
    if (categoryFilter !== 'all' && prediction.category !== categoryFilter) {
      return false;
    }
    
    return true;
  });
  
  // Sort predictions by risk score (probability * impact) in descending order
  const sortedPredictions = [...filteredPredictions].sort(
    (a, b) => (b.probability * b.impact) - (a.probability * a.impact)
  );
  
  // Group predictions by timeframe
  const groupedByTimeframe = {
    short: sortedPredictions.filter(p => p.timeframe === 'short'),
    medium: sortedPredictions.filter(p => p.timeframe === 'medium'),
    long: sortedPredictions.filter(p => p.timeframe === 'long'),
  };
  
  // Get appropriate icon for a category
  const getCategoryIcon = (category: RiskCategory) => {
    switch (category) {
      case RiskCategory.CREDIT:
        return <DollarSign className="h-4 w-4" />;
      case RiskCategory.COUNTRY:
        return <AlertTriangle className="h-4 w-4" />;
      case RiskCategory.CURRENCY:
        return <TrendingUp className="h-4 w-4" />;
      case RiskCategory.DELIVERY:
        return <Clock className="h-4 w-4" />;
      case RiskCategory.PAYMENT:
        return <DollarSign className="h-4 w-4" />;
      case RiskCategory.DOCUMENTATION:
        return <FileCheck className="h-4 w-4" />;
      case RiskCategory.REGULATORY:
        return <ShieldCheck className="h-4 w-4" />;
      case RiskCategory.FRAUD:
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  // Format timeframe for display
  const formatTimeframe = (timeframe: string) => {
    switch (timeframe) {
      case 'short':
        return '1-3 Months';
      case 'medium':
        return '3-6 Months';
      case 'long':
        return '6-12 Months';
      default:
        return timeframe;
    }
  };
  
  // Get badge color based on risk score
  const getRiskScoreColor = (score: number) => {
    if (score > 7) return 'red';
    if (score > 5) return 'orange';
    if (score > 3) return 'yellow';
    return 'green';
  };
  
  // Calculate total potential loss
  const totalPotentialLoss = sortedPredictions.reduce(
    (sum, prediction) => sum + prediction.potentialLoss * prediction.probability,
    0
  );

  return (
    <div className="space-y-4">
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 text-primary mr-2" />
                Predictive Risk Insights
              </CardTitle>
              <CardDescription>
                AI-powered predictions of potential risks and their impacts
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Select 
                value={timeframeFilter} 
                onValueChange={(value) => setTimeframeFilter(value)}
              >
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="All Timeframes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Timeframes</SelectItem>
                  <SelectItem value="short">Short Term (1-3M)</SelectItem>
                  <SelectItem value="medium">Medium Term (3-6M)</SelectItem>
                  <SelectItem value="long">Long Term (6-12M)</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={categoryFilter} 
                onValueChange={(value: any) => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.values(RiskCategory).map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-md">
                <Button 
                  variant={view === 'cards' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setView('cards')}
                  className="rounded-r-none"
                >
                  <BarChart className="h-4 w-4" />
                </Button>
                <Button 
                  variant={view === 'table' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setView('table')}
                  className="rounded-l-none"
                >
                  <Table className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Predicted Risks</p>
                    <h4 className="text-2xl font-bold mt-1">{sortedPredictions.length}</h4>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Gauge className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex items-center text-xs text-gray-500">
                  <div className="flex items-center mr-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                    <span>High: {sortedPredictions.filter(p => p.probability * p.impact > 6).length}</span>
                  </div>
                  <div className="flex items-center mr-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                    <span>Medium: {sortedPredictions.filter(p => p.probability * p.impact > 3 && p.probability * p.impact <= 6).length}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    <span>Low: {sortedPredictions.filter(p => p.probability * p.impact <= 3).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Potential Loss</p>
                    <h4 className="text-2xl font-bold mt-1 text-red-600">${totalPotentialLoss.toLocaleString()}</h4>
                  </div>
                  <div className="p-3 bg-red-50 rounded-full text-red-500">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between items-center text-xs">
                  <div className="text-gray-500">Risk-adjusted value</div>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    View Breakdown <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Confidence Level</p>
                    <h4 className="text-2xl font-bold mt-1">
                      {sortedPredictions.length > 0
                        ? (sortedPredictions.reduce((sum, p) => sum + p.confidence, 0) / sortedPredictions.length * 100).toFixed(0)
                        : 0}%
                    </h4>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full text-blue-500">
                    <LineChart className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex items-center text-xs text-gray-500">
                  <div className="text-gray-500">Based on historical data analysis and AI predictions</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Mitigation Options</p>
                    <h4 className="text-2xl font-bold mt-1">
                      {sortedPredictions.reduce((sum, p) => sum + p.mitigationOptions.length, 0)}
                    </h4>
                  </div>
                  <div className="p-3 bg-green-50 rounded-full text-green-500">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between items-center text-xs">
                  <div className="text-gray-500">Actionable strategies</div>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    Export Report <Download className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {sortedPredictions.length > 0 ? (
            <>
              {view === 'cards' ? (
                <Tabs defaultValue="all" className="mb-6">
                  <TabsList>
                    <TabsTrigger value="all">All Timeframes</TabsTrigger>
                    <TabsTrigger value="short">Short Term</TabsTrigger>
                    <TabsTrigger value="medium">Medium Term</TabsTrigger>
                    <TabsTrigger value="long">Long Term</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sortedPredictions.map((prediction, index) => (
                        <PredictionCard key={index} prediction={prediction} />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="short" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groupedByTimeframe.short.map((prediction, index) => (
                        <PredictionCard key={index} prediction={prediction} />
                      ))}
                    </div>
                    
                    {groupedByTimeframe.short.length === 0 && (
                      <div className="text-center py-8">
                        <Clock className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Short-Term Risks</h3>
                        <p className="text-gray-500 mt-1 max-w-md mx-auto">
                          No significant short-term risks have been predicted for your current trade portfolio.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="medium" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groupedByTimeframe.medium.map((prediction, index) => (
                        <PredictionCard key={index} prediction={prediction} />
                      ))}
                    </div>
                    
                    {groupedByTimeframe.medium.length === 0 && (
                      <div className="text-center py-8">
                        <Clock className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Medium-Term Risks</h3>
                        <p className="text-gray-500 mt-1 max-w-md mx-auto">
                          No significant medium-term risks have been predicted for your current trade portfolio.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="long" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groupedByTimeframe.long.map((prediction, index) => (
                        <PredictionCard key={index} prediction={prediction} />
                      ))}
                    </div>
                    
                    {groupedByTimeframe.long.length === 0 && (
                      <div className="text-center py-8">
                        <Clock className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Long-Term Risks</h3>
                        <p className="text-gray-500 mt-1 max-w-md mx-auto">
                          No significant long-term risks have been predicted for your current trade portfolio.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Potential Loss</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Timeframe</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {sortedPredictions.map((prediction, index) => {
                          const riskScore = prediction.probability * prediction.impact;
                          const color = getRiskScoreColor(riskScore);
                          
                          return (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className={`p-1.5 rounded-full bg-${color}-50 text-${color}-500 mr-2`}>
                                    {getCategoryIcon(prediction.category)}
                                  </div>
                                  <span className="font-medium">{prediction.category}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm">{prediction.factors[0]}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-center">
                                <Badge 
                                  className={`bg-${color}-100 text-${color}-800 border-${color}-200`}
                                >
                                  {riskScore.toFixed(1)}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-center">
                                <div className="text-sm">{(prediction.probability * 100).toFixed(0)}%</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-center">
                                <div className="text-sm">{prediction.impact.toFixed(1)}/10</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right">
                                <div className="text-sm font-medium text-red-600">${prediction.potentialLoss.toLocaleString()}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-center">
                                <Badge variant="outline">
                                  {formatTimeframe(prediction.timeframe)}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs text-primary"
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
              <Lightbulb className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Predictions Found</h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                No predictions match your current filter criteria. Try adjusting your filters or generate new insights.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setCategoryFilter('all');
                  setTimeframeFilter('all');
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface PredictionCardProps {
  prediction: RiskPrediction;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
  const riskScore = prediction.probability * prediction.impact;
  const color = riskScore > 7 ? 'red' : riskScore > 5 ? 'orange' : riskScore > 3 ? 'yellow' : 'green';
  
  // Get appropriate icon for a category
  const getCategoryIcon = (category: RiskCategory) => {
    switch (category) {
      case RiskCategory.CREDIT:
        return <DollarSign className="h-5 w-5" />;
      case RiskCategory.COUNTRY:
        return <AlertTriangle className="h-5 w-5" />;
      case RiskCategory.CURRENCY:
        return <TrendingUp className="h-5 w-5" />;
      case RiskCategory.DELIVERY:
        return <Clock className="h-5 w-5" />;
      case RiskCategory.PAYMENT:
        return <DollarSign className="h-5 w-5" />;
      case RiskCategory.DOCUMENTATION:
        return <FileCheck className="h-5 w-5" />;
      case RiskCategory.REGULATORY:
        return <ShieldCheck className="h-5 w-5" />;
      case RiskCategory.FRAUD:
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };
  
  return (
    <Card className={`border-t-4 border-t-${color}-500`}>
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-full bg-${color}-50 text-${color}-500 mr-3`}>
              {getCategoryIcon(prediction.category)}
            </div>
            <div>
              <Badge 
                className={`mb-1 bg-${color}-100 text-${color}-800 border-${color}-200`}
              >
                {prediction.category}
              </Badge>
              <h3 className="font-medium text-gray-900">{prediction.factors[0]}</h3>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Risk Score</div>
            <div className={`text-lg font-bold text-${color}-600`}>
              {riskScore.toFixed(1)}/10
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-sm text-gray-500">Probability</div>
            <div className="text-lg font-medium">{(prediction.probability * 100).toFixed(0)}%</div>
            <Progress
              value={prediction.probability * 100}
              className="h-1.5 mt-1"
              indicatorClassName={`bg-${color}-500`}
            />
          </div>
          <div>
            <div className="text-sm text-gray-500">Impact</div>
            <div className="text-lg font-medium">{prediction.impact.toFixed(1)}/10</div>
            <Progress
              value={prediction.impact * 10}
              className="h-1.5 mt-1"
              indicatorClassName={`bg-${color}-500`}
            />
          </div>
          <div>
            <div className="text-sm text-gray-500">Timeframe</div>
            <div className="text-lg font-medium capitalize">{prediction.timeframe}</div>
            <div className="text-xs text-gray-500 mt-1">
              {prediction.timeframe === 'short' ? '1-3 Months' : 
               prediction.timeframe === 'medium' ? '3-6 Months' : 
               '6-12 Months'}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t">
          <div>
            <div className="text-sm text-gray-500">Potential Loss</div>
            <div className="text-lg font-medium text-red-600">${prediction.potentialLoss.toLocaleString()}</div>
          </div>
          
          {prediction.mitigationOptions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className={`border-${color}-200 text-${color}-700 hover:bg-${color}-50`}
            >
              View Mitigation Options
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskPredictions;