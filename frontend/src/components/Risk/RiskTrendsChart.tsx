import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TrendingUp,
  TrendingDown, 
  AlertCircle,
  Calendar,
  BarChart2,
  LineChart as LineChartIcon,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { RiskTrend, RiskCategory } from '@/types/risk';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface RiskTrendsChartProps {
  trends: RiskTrend[];
}

const RiskTrendsChart: React.FC<RiskTrendsChartProps> = ({ trends }) => {
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory | 'all'>('all');
  const [timeRange, setTimeRange] = useState('6m'); // 1m, 3m, 6m, 1y
  const [showOptions, setShowOptions] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  
  // Filter trends based on selected category
  const selectedTrends = selectedCategory === 'all' 
    ? trends 
    : trends.filter(trend => trend.category === selectedCategory);
  
  // Prepare data for the chart
  const prepareChartData = () => {
    if (selectedTrends.length === 0) return [];
    
    // Get all unique dates across selected trends
    const allDates = new Set<string>();
    selectedTrends.forEach(trend => {
      trend.values.forEach(value => allDates.add(value.date));
      trend.forecast.forEach(value => allDates.add(value.date));
    });
    
    // Create a sorted array of dates
    const sortedDates = Array.from(allDates).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );
    
    // Filter dates based on selected time range
    const now = new Date();
    let cutoffDate;
    
    switch (timeRange) {
      case '1m':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3m':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6m':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1y':
        cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        cutoffDate = new Date(now.setMonth(now.getMonth() - 6));
    }
    
    const filteredDates = sortedDates.filter(date => 
      new Date(date).getTime() >= cutoffDate.getTime()
    );
    
    // Create chart data with all series
    return filteredDates.map(date => {
      const dataPoint: { [key: string]: any } = { date: formatDate(date) };
      
      selectedTrends.forEach(trend => {
        // Historical values
        const valuePoint = trend.values.find(v => v.date === date);
        if (valuePoint) {
          dataPoint[`${trend.category}`] = valuePoint.value;
        }
        
        // Forecast values
        const forecastPoint = trend.forecast.find(f => f.date === date);
        if (forecastPoint) {
          dataPoint[`${trend.category}_forecast`] = forecastPoint.value;
          dataPoint[`${trend.category}_confidence`] = forecastPoint.confidence;
        }
      });
      
      return dataPoint;
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Get color for a category
  const getCategoryColor = (category: RiskCategory): string => {
    switch (category) {
      case RiskCategory.CREDIT:
        return '#4f46e5'; // indigo
      case RiskCategory.COUNTRY:
        return '#0ea5e9'; // sky
      case RiskCategory.CURRENCY:
        return '#10b981'; // emerald
      case RiskCategory.DELIVERY:
        return '#f59e0b'; // amber
      case RiskCategory.PAYMENT:
        return '#6366f1'; // indigo
      case RiskCategory.DOCUMENTATION:
        return '#8b5cf6'; // violet
      case RiskCategory.REGULATORY:
        return '#ec4899'; // pink
      case RiskCategory.FRAUD:
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };
  
  // Determine if trends are increasing, decreasing, or stable
  const getTrendDirection = (trend: RiskTrend): 'increasing' | 'decreasing' | 'stable' => {
    if (trend.values.length < 2) return 'stable';
    
    const values = [...trend.values].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const firstValue = values[0].value;
    const lastValue = values[values.length - 1].value;
    
    const change = lastValue - firstValue;
    const percentChange = (change / firstValue) * 100;
    
    if (percentChange > 5) return 'increasing';
    if (percentChange < -5) return 'decreasing';
    return 'stable';
  };
  
  // Calculate average risk levels for selected trends
  const calculateAverageRisk = () => {
    if (selectedTrends.length === 0) return { avg: 0, direction: 'stable' as const };
    
    const latestValues = selectedTrends.map(trend => {
      const sortedValues = [...trend.values].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return sortedValues[0]?.value || 0;
    });
    
    const avg = latestValues.reduce((sum, val) => sum + val, 0) / latestValues.length;
    
    const directions = selectedTrends.map(trend => getTrendDirection(trend));
    const increasingCount = directions.filter(d => d === 'increasing').length;
    const decreasingCount = directions.filter(d => d === 'decreasing').length;
    
    let direction: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (increasingCount > decreasingCount) direction = 'increasing';
    else if (decreasingCount > increasingCount) direction = 'decreasing';
    
    return { avg, direction };
  };
  
  const { avg, direction } = calculateAverageRisk();
  const chartData = prepareChartData();
  
  return (
    <div className="space-y-4">
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 text-primary mr-2" />
              Risk Trends & Forecasts
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-1" />
                Options
                {showOptions ? (
                  <ChevronUp className="h-3 w-3 ml-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 ml-1" />
                )}
              </Button>
              
              <div className="hidden md:flex space-x-1">
                <Button 
                  variant={timeRange === '1m' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setTimeRange('1m')}
                >
                  1M
                </Button>
                <Button 
                  variant={timeRange === '3m' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setTimeRange('3m')}
                >
                  3M
                </Button>
                <Button 
                  variant={timeRange === '6m' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setTimeRange('6m')}
                >
                  6M
                </Button>
                <Button 
                  variant={timeRange === '1y' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setTimeRange('1y')}
                >
                  1Y
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        {/* Options and filters */}
        {showOptions && (
          <CardContent className="border-b pb-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Risk Category</label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={(value: any) => setSelectedCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.values(RiskCategory).map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Time Range</label>
                <Select 
                  value={timeRange} 
                  onValueChange={(value) => setTimeRange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 Month</SelectItem>
                    <SelectItem value="3m">3 Months</SelectItem>
                    <SelectItem value="6m">6 Months</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Chart Type</label>
                <Select 
                  value={chartType} 
                  onValueChange={(value: any) => setChartType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chart Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        )}
        
        <CardContent className="pt-4">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="shadow-sm">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className={`p-2 rounded-full ${
                  direction === 'increasing' 
                    ? 'bg-red-50 text-red-500' 
                    : direction === 'decreasing' 
                    ? 'bg-green-50 text-green-500' 
                    : 'bg-gray-50 text-gray-500'
                } mb-2`}>
                  {direction === 'increasing' ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : direction === 'decreasing' ? (
                    <TrendingDown className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                </div>
                <div className="text-sm text-gray-500">Average Risk Level</div>
                <div className="text-2xl font-bold">{avg.toFixed(1)}%</div>
                <div className={`text-xs ${
                  direction === 'increasing' 
                    ? 'text-red-500' 
                    : direction === 'decreasing' 
                    ? 'text-green-500' 
                    : 'text-gray-500'
                }`}>
                  {direction === 'increasing' 
                    ? 'Increasing' 
                    : direction === 'decreasing' 
                    ? 'Decreasing' 
                    : 'Stable'}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="p-2 rounded-full bg-primary/10 text-primary mb-2">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="text-sm text-gray-500">Time Period</div>
                <div className="text-2xl font-bold">
                  {timeRange === '1m' ? '1 Month' : 
                   timeRange === '3m' ? '3 Months' : 
                   timeRange === '6m' ? '6 Months' : '1 Year'}
                </div>
                <div className="text-xs text-gray-500">
                  {chartData.length > 0 && `${chartData.length} data points`}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="p-2 rounded-full bg-primary/10 text-primary mb-2">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <div className="text-sm text-gray-500">Categories Tracked</div>
                <div className="text-2xl font-bold">
                  {selectedCategory === 'all' ? trends.length : 1}
                </div>
                <div className="text-xs text-gray-500">
                  {selectedCategory === 'all' ? 'All categories' : selectedCategory}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="p-2 rounded-full bg-primary/10 text-primary mb-2">
                  <LineChartIcon className="h-5 w-5" />
                </div>
                <div className="text-sm text-gray-500">Forecast Range</div>
                <div className="text-2xl font-bold">90 Days</div>
                <div className="text-xs text-gray-500">
                  Predictive insights
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main chart */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedTrends.map(trend => (
                <Badge
                  key={trend.category}
                  variant="outline"
                  className="text-xs font-medium"
                  style={{ color: getCategoryColor(trend.category), borderColor: getCategoryColor(trend.category) + '40' }}
                >
                  {trend.category}
                  {getTrendDirection(trend) === 'increasing' ? (
                    <TrendingUp className="ml-1 h-3 w-3" />
                  ) : getTrendDirection(trend) === 'decreasing' ? (
                    <TrendingDown className="ml-1 h-3 w-3" />
                  ) : null}
                </Badge>
              ))}
            </div>
            
            <div className="h-[350px] w-full">
              {chartData.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <BarChart2 className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                    <p className="text-gray-500">No data available for selected criteria</p>
                  </div>
                </div>
              ) : chartType === 'line' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    
                    {selectedTrends.map(trend => (
                      <React.Fragment key={trend.category}>
                        <Line
                          type="monotone"
                          dataKey={trend.category}
                          stroke={getCategoryColor(trend.category)}
                          strokeWidth={2}
                          dot={{ r: 1 }}
                          activeDot={{ r: 5 }}
                          name={trend.category}
                        />
                        <Line
                          type="monotone"
                          dataKey={`${trend.category}_forecast`}
                          stroke={getCategoryColor(trend.category)}
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          dot={false}
                          name={`${trend.category} Forecast`}
                        />
                      </React.Fragment>
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : chartType === 'area' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    
                    {selectedTrends.map(trend => (
                      <React.Fragment key={trend.category}>
                        <Area
                          type="monotone"
                          dataKey={trend.category}
                          fill={getCategoryColor(trend.category) + '40'}
                          stroke={getCategoryColor(trend.category)}
                          activeDot={{ r: 5 }}
                          name={trend.category}
                        />
                        <Area
                          type="monotone"
                          dataKey={`${trend.category}_forecast`}
                          fill={getCategoryColor(trend.category) + '20'}
                          stroke={getCategoryColor(trend.category)}
                          strokeDasharray="5 5"
                          name={`${trend.category} Forecast`}
                        />
                      </React.Fragment>
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    
                    {selectedTrends.map(trend => (
                      <React.Fragment key={trend.category}>
                        <Bar
                          dataKey={trend.category}
                          fill={getCategoryColor(trend.category)}
                          name={trend.category}
                        />
                        <Bar
                          dataKey={`${trend.category}_forecast`}
                          fill={getCategoryColor(trend.category) + '60'}
                          stroke={getCategoryColor(trend.category)}
                          strokeWidth={1}
                          name={`${trend.category} Forecast`}
                        />
                      </React.Fragment>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Note:</span> Dashed lines represent AI-generated predictions with {(trends[0]?.forecast[0]?.confidence || 0.8) * 100}% confidence.
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="text-primary"
              >
                Export Data <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskTrendsChart;