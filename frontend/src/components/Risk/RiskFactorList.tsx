import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  CreditCard, 
  Truck, 
  FileText, 
  DollarSign, 
  Landmark, 
  Shield, 
  Globe, 
  Filter, 
  ChevronUp, 
  ChevronDown,
  BarChart,
  SortAsc,
  SortDesc,
  ArrowUpRight,
  Check
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiskFactor, RiskLevel, RiskCategory } from '@/types/risk';

interface RiskFactorListProps {
  riskFactors: RiskFactor[];
}

const RiskFactorList: React.FC<RiskFactorListProps> = ({ riskFactors }) => {
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    category: 'all',
    trend: 'all',
    searchTerm: '',
  });
  const [sortBy, setSortBy] = useState<'level' | 'value' | 'category'>('value');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter risk factors based on current filters
  const filteredFactors = riskFactors.filter(factor => {
    // Filter by risk level
    if (filters.riskLevel !== 'all' && factor.level !== filters.riskLevel) {
      return false;
    }
    
    // Filter by category
    if (filters.category !== 'all' && factor.category !== filters.category) {
      return false;
    }
    
    // Filter by trend
    if (filters.trend !== 'all' && factor.trend !== filters.trend) {
      return false;
    }
    
    // Filter by search term
    if (filters.searchTerm && !factor.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort filtered factors
  const sortedFactors = [...filteredFactors].sort((a, b) => {
    if (sortBy === 'level') {
      const levelOrder = {
        [RiskLevel.CRITICAL]: 4,
        [RiskLevel.HIGH]: 3,
        [RiskLevel.MEDIUM]: 2,
        [RiskLevel.LOW]: 1
      };
      
      return sortDir === 'desc' 
        ? levelOrder[b.level] - levelOrder[a.level]
        : levelOrder[a.level] - levelOrder[b.level];
    }
    
    if (sortBy === 'value') {
      return sortDir === 'desc' ? b.value - a.value : a.value - b.value;
    }
    
    if (sortBy === 'category') {
      return sortDir === 'desc'
        ? b.category.localeCompare(a.category)
        : a.category.localeCompare(b.category);
    }
    
    return 0;
  });
  
  // Reset filters to default
  const resetFilters = () => {
    setFilters({
      riskLevel: 'all',
      category: 'all',
      trend: 'all',
      searchTerm: '',
    });
    setSortBy('value');
    setSortDir('desc');
  };
  
  // Toggle sort direction when clicking on the same sort field
  const handleSort = (field: 'level' | 'value' | 'category') => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };
  
  // Get appropriate color for a risk level
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
  
  // Get appropriate icon for a category
  const getCategoryIcon = (category: RiskCategory) => {
    switch (category) {
      case RiskCategory.CREDIT:
        return <CreditCard className="h-4 w-4" />;
      case RiskCategory.COUNTRY:
        return <Globe className="h-4 w-4" />;
      case RiskCategory.CURRENCY:
        return <DollarSign className="h-4 w-4" />;
      case RiskCategory.DELIVERY:
        return <Truck className="h-4 w-4" />;
      case RiskCategory.PAYMENT:
        return <Landmark className="h-4 w-4" />;
      case RiskCategory.DOCUMENTATION:
        return <FileText className="h-4 w-4" />;
      case RiskCategory.REGULATORY:
        return <Shield className="h-4 w-4" />;
      case RiskCategory.FRAUD:
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  // Group factors by category for summary view
  const groupedByCategory = Object.values(RiskCategory).map(category => {
    const categoryFactors = riskFactors.filter(factor => factor.category === category);
    
    if (categoryFactors.length === 0) {
      return {
        category,
        count: 0,
        avgValue: 0,
        maxValue: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        increasingCount: 0,
        decreasingCount: 0,
        stableCount: 0,
      };
    }
    
    const avgValue = categoryFactors.reduce((sum, factor) => sum + factor.value, 0) / categoryFactors.length;
    const maxValue = Math.max(...categoryFactors.map(factor => factor.value));
    
    const criticalCount = categoryFactors.filter(factor => factor.level === RiskLevel.CRITICAL).length;
    const highCount = categoryFactors.filter(factor => factor.level === RiskLevel.HIGH).length;
    const mediumCount = categoryFactors.filter(factor => factor.level === RiskLevel.MEDIUM).length;
    const lowCount = categoryFactors.filter(factor => factor.level === RiskLevel.LOW).length;
    
    const increasingCount = categoryFactors.filter(factor => factor.trend === 'increasing').length;
    const decreasingCount = categoryFactors.filter(factor => factor.trend === 'decreasing').length;
    const stableCount = categoryFactors.filter(factor => factor.trend === 'stable').length;
    
    return {
      category,
      count: categoryFactors.length,
      avgValue,
      maxValue,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      increasingCount,
      decreasingCount,
      stableCount,
    };
  }).sort((a, b) => b.maxValue - a.maxValue);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 text-primary mr-2" />
              Risk Categories Summary
            </CardTitle>
            <CardDescription>
              Breakdown of risk factors by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupedByCategory
                .filter(group => group.count > 0)
                .slice(0, 5)
                .map(group => {
                  let levelColor;
                  if (group.maxValue > 75) levelColor = 'red';
                  else if (group.maxValue > 50) levelColor = 'orange';
                  else if (group.maxValue > 25) levelColor = 'yellow';
                  else levelColor = 'green';

                  return (
                    <div key={group.category} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`p-1.5 rounded-full bg-${levelColor}-50 text-${levelColor}-500 mr-2`}>
                            {getCategoryIcon(group.category)}
                          </div>
                          <span>{group.category}</span>
                        </div>
                        <div className="flex items-center">
                          <Badge
                            className={`bg-${levelColor}-100 text-${levelColor}-700 border-${levelColor}-200 mr-2`}
                          >
                            Max: {group.maxValue.toFixed(0)}%
                          </Badge>
                          <span className="text-xs text-gray-500">({group.count})</span>
                        </div>
                      </div>
                      
                      <Progress
                        value={group.avgValue}
                        className="h-2"
                        indicatorClassName={`bg-${levelColor}-500`}
                      />
                      
                      <div className="flex text-xs text-gray-500 justify-between">
                        <div className="flex space-x-2">
                          {group.criticalCount > 0 && (
                            <span className="text-red-500">{group.criticalCount} Critical</span>
                          )}
                          {group.highCount > 0 && (
                            <span className="text-orange-500">{group.highCount} High</span>
                          )}
                          {group.mediumCount > 0 && (
                            <span className="text-yellow-500">{group.mediumCount} Medium</span>
                          )}
                        </div>
                        <div>
                          Avg: {group.avgValue.toFixed(0)}%
                        </div>
                      </div>
                      
                      <div className="flex text-xs text-gray-500 justify-between">
                        <div className="flex space-x-2">
                          {group.increasingCount > 0 && (
                            <span className="flex items-center text-red-500">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {group.increasingCount}
                            </span>
                          )}
                          {group.decreasingCount > 0 && (
                            <span className="flex items-center text-green-500">
                              <TrendingDown className="h-3 w-3 mr-1" />
                              {group.decreasingCount}
                            </span>
                          )}
                          {group.stableCount > 0 && (
                            <span>{group.stableCount} Stable</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
              {groupedByCategory.filter(group => group.count > 0).length === 0 && (
                <div className="text-center py-8">
                  <BarChart className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No Risk Data</h3>
                  <p className="text-gray-500 mt-1 max-w-md mx-auto">
                    No risk factors are currently available for analysis.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-primary mr-2" />
              Top Risk Factors
            </CardTitle>
            <CardDescription>
              Highest-impact risk factors in your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskFactors
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map(factor => {
                  const color = getRiskLevelColor(factor.level);
                  
                  return (
                    <Card key={factor.id} className={`shadow-sm border-l-2 border-l-${color}-500`}>
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-full bg-${color}-50 text-${color}-500 mt-0.5 flex-shrink-0`}>
                            {getCategoryIcon(factor.category)}
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <Badge
                                  className={`mr-1 bg-${color}-100 text-${color}-700 border-${color}-200`}
                                >
                                  {factor.level}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="mr-1 border-gray-200 text-gray-700"
                                >
                                  {factor.category}
                                </Badge>
                              </div>
                              <div className={`text-sm font-semibold ${
                                factor.trend === 'increasing' 
                                  ? 'text-red-500' 
                                  : factor.trend === 'decreasing' 
                                  ? 'text-green-500' 
                                  : 'text-gray-500'
                              } flex items-center`}>
                                {factor.trend === 'increasing' ? (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                ) : factor.trend === 'decreasing' ? (
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                ) : null}
                                {factor.value.toFixed(0)}%
                              </div>
                            </div>
                            
                            <p className="text-sm">{factor.description}</p>
                            
                            <div className="flex text-xs text-gray-500 justify-between pt-1">
                              <div>{factor.impactDescription.substring(0, 60)}...</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
              {riskFactors.length === 0 && (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No Risk Factors</h3>
                  <p className="text-gray-500 mt-1 max-w-md mx-auto">
                    No risk factors are currently available for analysis.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-primary mr-2" />
              All Risk Factors ({filteredFactors.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-1" />
                Filters
                {showFilters ? (
                  <ChevronUp className="h-3 w-3 ml-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 ml-1" />
                )}
              </Button>
              
              <Button 
                variant={sortBy === 'value' ? "default" : "outline"} 
                size="sm"
                onClick={() => handleSort('value')}
                className="hidden sm:flex items-center"
              >
                Value
                {sortBy === 'value' && (
                  sortDir === 'desc' ? <SortDesc className="ml-1 h-3 w-3" /> : <SortAsc className="ml-1 h-3 w-3" />
                )}
              </Button>
              
              <Button 
                variant={sortBy === 'level' ? "default" : "outline"} 
                size="sm"
                onClick={() => handleSort('level')}
                className="hidden sm:flex items-center"
              >
                Risk Level
                {sortBy === 'level' && (
                  sortDir === 'desc' ? <SortDesc className="ml-1 h-3 w-3" /> : <SortAsc className="ml-1 h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Filters section */}
        {showFilters && (
          <CardContent className="border-b pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Risk Level</label>
                <Select 
                  value={filters.riskLevel} 
                  onValueChange={(value) => setFilters({...filters, riskLevel: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Risk Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    {Object.values(RiskLevel).map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={filters.category} 
                  onValueChange={(value) => setFilters({...filters, category: value})}
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
                <label className="text-sm font-medium">Trend</label>
                <Select 
                  value={filters.trend} 
                  onValueChange={(value) => setFilters({...filters, trend: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Trends" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Trends</SelectItem>
                    <SelectItem value="increasing">Increasing</SelectItem>
                    <SelectItem value="decreasing">Decreasing</SelectItem>
                    <SelectItem value="stable">Stable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search risk factors..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-3">
              <div className="text-xs text-gray-500">
                Showing {filteredFactors.length} of {riskFactors.length} risk factors
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="h-7 text-xs"
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        )}
        
        <CardContent className="pt-4">
          {sortedFactors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Risk Factors Found</h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                No risk factors match your current filter criteria. Try adjusting your filters or generate new risk assessments.
              </p>
              <Button className="mt-4" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedFactors.map(factor => {
                const color = getRiskLevelColor(factor.level);
                
                return (
                  <Card key={factor.id} className="shadow-sm overflow-hidden border-none">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge 
                              className={`bg-${color}-100 text-${color}-700 border-${color}-200`}
                            >
                              {factor.level}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-gray-200 text-gray-700"
                            >
                              {factor.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`${
                                factor.trend === 'increasing' 
                                  ? 'bg-red-50 text-red-600 border-red-200' 
                                  : factor.trend === 'decreasing' 
                                  ? 'bg-green-50 text-green-600 border-green-200' 
                                  : 'bg-gray-50 text-gray-600 border-gray-200'
                              }`}
                            >
                              {factor.trend === 'increasing' ? (
                                <TrendingUp className="mr-1 h-3 w-3 inline" />
                              ) : factor.trend === 'decreasing' ? (
                                <TrendingDown className="mr-1 h-3 w-3 inline" />
                              ) : null}
                              {factor.trend.charAt(0).toUpperCase() + factor.trend.slice(1)}
                            </Badge>
                          </div>
                          
                          <h3 className="text-base font-medium">{factor.description}</h3>
                          
                          <div className="flex items-center">
                            <div className="flex-1 mr-4">
                              <Progress
                                value={factor.value}
                                className="h-2"
                                indicatorClassName={`bg-${color}-500`}
                              />
                            </div>
                            <div className="text-sm font-medium">
                              {factor.value.toFixed(0)}%
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600">{factor.impactDescription}</p>
                        </div>
                        
                        <div className="sm:border-l sm:pl-4 flex flex-row sm:flex-col sm:justify-center justify-between gap-2">
                          <Button variant="outline" size="sm" className="flex items-center text-primary">
                            <ArrowUpRight className="mr-1 h-4 w-4" />
                            Details
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center text-primary">
                            <Check className="mr-1 h-4 w-4" />
                            Mitigate
                          </Button>
                        </div>
                      </div>
                      
                      {factor.mitigationSuggestions && factor.mitigationSuggestions.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <h4 className="text-sm font-medium mb-2">Mitigation Suggestions:</h4>
                          <ul className="text-sm text-gray-600">
                            {factor.mitigationSuggestions.slice(0, 2).map((suggestion, index) => (
                              <li key={index} className="flex items-start mb-1">
                                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                <span>{suggestion}</span>
                              </li>
                            ))}
                            {factor.mitigationSuggestions.length > 2 && (
                              <li className="text-primary text-xs cursor-pointer ml-6">
                                + {factor.mitigationSuggestions.length - 2} more suggestions
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskFactorList;