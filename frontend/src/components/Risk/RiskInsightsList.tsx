import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Check,
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
  ArrowUpRight
} from 'lucide-react';
import { RiskInsight, RiskLevel, RiskCategory } from '@/types/risk';

interface RiskInsightsListProps {
  insights: RiskInsight[];
}

const RiskInsightsList: React.FC<RiskInsightsListProps> = ({ insights }) => {
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    category: 'all',
    searchTerm: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortByDate, setSortByDate] = useState(true);
  const [sortByRisk, setSortByRisk] = useState(false);
  
  // Filter insights based on current filters
  const filteredInsights = insights.filter(insight => {
    // Filter by risk level
    if (filters.riskLevel !== 'all' && insight.riskLevel !== filters.riskLevel) {
      return false;
    }
    
    // Filter by category
    if (filters.category !== 'all' && insight.relatedCategory !== filters.category) {
      return false;
    }
    
    // Filter by search term
    if (filters.searchTerm && !insight.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !insight.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort insights based on sort criteria
  const sortedInsights = [...filteredInsights].sort((a, b) => {
    if (sortByDate) {
      return new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime();
    }
    
    if (sortByRisk) {
      const riskLevelOrder = {
        [RiskLevel.CRITICAL]: 4,
        [RiskLevel.HIGH]: 3,
        [RiskLevel.MEDIUM]: 2,
        [RiskLevel.LOW]: 1
      };
      
      return riskLevelOrder[b.riskLevel] - riskLevelOrder[a.riskLevel];
    }
    
    return 0;
  });
  
  // Reset filters to default
  const resetFilters = () => {
    setFilters({
      riskLevel: 'all',
      category: 'all',
      searchTerm: '',
    });
    setSortByDate(true);
    setSortByRisk(false);
  };
  
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
  
  return (
    <div className="space-y-4">
      <Card className="shadow-md">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 text-primary mr-2" />
              Trade Risk Insights ({filteredInsights.length})
            </CardTitle>
            <div className="flex space-x-2">
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
                variant={sortByDate ? "default" : "outline"} 
                size="sm"
                onClick={() => {
                  setSortByDate(true);
                  setSortByRisk(false);
                }}
                className="hidden sm:flex items-center"
              >
                Latest
              </Button>
              <Button 
                variant={sortByRisk ? "default" : "outline"} 
                size="sm"
                onClick={() => {
                  setSortByDate(false);
                  setSortByRisk(true);
                }}
                className="hidden sm:flex items-center"
              >
                Highest Risk
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Filters section */}
        {showFilters && (
          <CardContent className="border-b pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search insights..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-3">
              <div className="text-xs text-gray-500">
                Showing {filteredInsights.length} of {insights.length} insights
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="h-7 text-xs flex items-center"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset Filters
              </Button>
            </div>
          </CardContent>
        )}
        
        <CardContent className="pt-4">
          <div className="space-y-4">
            {sortedInsights.length === 0 ? (
              <div className="py-12 text-center">
                <Lightbulb className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No Insights Found</h3>
                <p className="text-gray-500 mt-1 max-w-md mx-auto">
                  No insights match your current filter criteria. Try adjusting your filters or generating new insights.
                </p>
                <Button className="mt-4" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              sortedInsights.map(insight => {
                const color = getRiskLevelColor(insight.riskLevel);
                const issueDate = new Date(insight.expiresAt);
                issueDate.setMonth(issueDate.getMonth() - 1); // Assuming insight expires 1 month after issue
                
                return (
                  <Card key={insight.id} className={`border-l-4 border-l-${color}-500 shadow-sm`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-start">
                            <div className={`p-1.5 rounded-full bg-${color}-50 text-${color}-500 mr-2 mt-0.5`}>
                              <AlertTriangle className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{insight.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {insight.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 pl-9">
                            <Badge 
                              variant="outline" 
                              className={`text-xs bg-${color}-50 text-${color}-700 border-${color}-200`}
                            >
                              {insight.riskLevel}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-gray-50 text-gray-700 border-gray-200"
                            >
                              {insight.relatedCategory}
                            </Badge>
                            <span className="text-xs">
                              Generated: {issueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-xs">
                              Expires: {new Date(insight.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-xs">
                              Source: {insight.source}
                            </span>
                          </div>
                        </div>
                        
                        <div className="sm:pl-4 flex flex-col sm:items-end gap-2 pl-9 sm:pl-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`text-${color}-700 border-${color}-200 hover:bg-${color}-50`}
                          >
                            View Impact <ArrowUpRight className="ml-1 h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary"
                          >
                            View Recommendation <Check className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskInsightsList;