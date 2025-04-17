import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Users,
  User,
  AlertTriangle,
  Search,
  SortAsc,
  SortDesc,
  Filter,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  Clock,
  ArrowUpRight,
  BarChart,
  PieChart,
  DollarSign,
  FileText,
  Calendar
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PartnerRisk, RiskLevel } from '@/types/risk';

interface PartnerRiskTableProps {
  partnerRisks: PartnerRisk[];
}

const PartnerRiskTable: React.FC<PartnerRiskTableProps> = ({ partnerRisks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskLevelFilter, setRiskLevelFilter] = useState<RiskLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'creditScore'>('creditScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<PartnerRisk | null>(null);
  
  // Filter partners based on search term and risk level
  const filteredPartners = partnerRisks.filter(partner => {
    const matchesSearch = partner.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRiskLevel = riskLevelFilter === 'all' || partner.riskLevel === riskLevelFilter;
    
    return matchesSearch && matchesRiskLevel;
  });
  
  // Sort filtered partners
  const sortedPartners = [...filteredPartners].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDir === 'asc' 
        ? a.partnerName.localeCompare(b.partnerName) 
        : b.partnerName.localeCompare(a.partnerName);
    }
    
    if (sortBy === 'creditScore') {
      return sortDir === 'asc' 
        ? a.creditScore - b.creditScore 
        : b.creditScore - a.creditScore;
    }
    
    return 0;
  });
  
  // Toggle sort direction when clicking on the same sort field
  const handleSort = (field: 'name' | 'creditScore') => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };
  
  // Reset filters to default
  const resetFilters = () => {
    setSearchTerm('');
    setRiskLevelFilter('all');
    setSortBy('creditScore');
    setSortDir('desc');
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
  
  // Get appropriate color for a credit score
  const getCreditScoreColor = (score: number): string => {
    if (score > 80) return 'green';
    if (score > 60) return 'lime';
    if (score > 40) return 'yellow';
    if (score > 20) return 'orange';
    return 'red';
  };
  
  // Group partners by risk level
  const partnersByRiskLevel = {
    [RiskLevel.LOW]: partnerRisks.filter(p => p.riskLevel === RiskLevel.LOW),
    [RiskLevel.MEDIUM]: partnerRisks.filter(p => p.riskLevel === RiskLevel.MEDIUM),
    [RiskLevel.HIGH]: partnerRisks.filter(p => p.riskLevel === RiskLevel.HIGH),
    [RiskLevel.CRITICAL]: partnerRisks.filter(p => p.riskLevel === RiskLevel.CRITICAL),
  };
  
  // Calculate trade volume statistics
  const totalTradeVolume = partnerRisks.reduce((sum, p) => sum + p.totalTradeVolume, 0);
  const avgTransactionSize = partnerRisks.reduce((sum, p) => sum + p.avgTransactionSize, 0) / (partnerRisks.length || 1);
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="partners">Partner List</TabsTrigger>
          <TabsTrigger value="analysis">Risk Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Trading Partners</p>
                    <h4 className="text-2xl font-bold mt-1">{partnerRisks.length}</h4>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex items-center text-xs text-gray-500">
                  <div className="flex items-center mr-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                    <span>High Risk: {partnersByRiskLevel[RiskLevel.CRITICAL].length + partnersByRiskLevel[RiskLevel.HIGH].length}</span>
                  </div>
                  <div className="flex items-center mr-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                    <span>Medium: {partnersByRiskLevel[RiskLevel.MEDIUM].length}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    <span>Low: {partnersByRiskLevel[RiskLevel.LOW].length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Trade Volume</p>
                    <h4 className="text-2xl font-bold mt-1">${totalTradeVolume.toLocaleString()}</h4>
                  </div>
                  <div className="p-3 bg-green-50 rounded-full text-green-500">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs">
                  <div className="text-gray-500">Avg. Transaction: ${avgTransactionSize.toLocaleString()}</div>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">View Details</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Avg. Credit Score</p>
                    <h4 className="text-2xl font-bold mt-1">
                      {partnerRisks.length > 0
                        ? (partnerRisks.reduce((sum, p) => sum + p.creditScore, 0) / partnerRisks.length).toFixed(0)
                        : 0}%
                    </h4>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full text-blue-500">
                    <BarChart className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 text-primary mr-2" />
                  High Risk Partners
                </CardTitle>
                <CardDescription>
                  Partners requiring additional monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {partnerRisks
                    .filter(p => p.riskLevel === RiskLevel.HIGH || p.riskLevel === RiskLevel.CRITICAL)
                    .sort((a, b) => a.creditScore - b.creditScore)
                    .slice(0, 5)
                    .map(partner => {
                      const color = getRiskLevelColor(partner.riskLevel);
                      
                      return (
                        <div 
                          key={partner.partnerId} 
                          className="bg-white p-3 rounded-lg border shadow-sm flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => setSelectedPartner(partner)}
                        >
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full bg-${color}-50 text-${color}-500 mr-3`}>
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-medium">{partner.partnerName}</h4>
                              <p className="text-xs text-gray-500">
                                {partner.country} • {partner.relationshipYears} year{partner.relationshipYears !== 1 ? 's' : ''} relationship
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              className={`bg-${color}-100 text-${color}-700 border-${color}-200 mb-1`}
                            >
                              {partner.riskLevel}
                            </Badge>
                            <div className="text-sm font-medium">
                              Score: {partner.creditScore}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                  {partnerRisks.filter(p => p.riskLevel === RiskLevel.HIGH || p.riskLevel === RiskLevel.CRITICAL).length === 0 && (
                    <div className="text-center py-6">
                      <Check className="mx-auto h-10 w-10 text-green-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900">No High Risk Partners</h3>
                      <p className="text-gray-500 mt-1 max-w-md mx-auto">
                        None of your trading partners currently have a high risk rating.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              {partnerRisks.filter(p => p.riskLevel === RiskLevel.HIGH || p.riskLevel === RiskLevel.CRITICAL).length > 5 && (
                <CardFooter className="border-t pt-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-primary"
                    onClick={() => {
                      setRiskLevelFilter(RiskLevel.HIGH);
                      document.getElementById('partner-list-tab')?.click();
                    }}
                  >
                    View All High Risk Partners
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <PieChart className="h-5 w-5 text-primary mr-2" />
                  Payment Performance
                </CardTitle>
                <CardDescription>
                  Partner payment history analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-3 text-center">
                      <div className="p-2 rounded-full bg-green-50 text-green-500 mx-auto mb-2 w-8 h-8 flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="text-xs text-gray-500">On-time Payments</div>
                      <div className="text-lg font-semibold text-green-600 mt-1">
                        {partnerRisks.reduce((sum, p) => sum + p.paymentHistory.onTimePayments, 0)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-3 text-center">
                      <div className="p-2 rounded-full bg-yellow-50 text-yellow-500 mx-auto mb-2 w-8 h-8 flex items-center justify-center">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="text-xs text-gray-500">Late Payments</div>
                      <div className="text-lg font-semibold text-yellow-600 mt-1">
                        {partnerRisks.reduce((sum, p) => sum + p.paymentHistory.latePayments, 0)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-3 text-center">
                      <div className="p-2 rounded-full bg-red-50 text-red-500 mx-auto mb-2 w-8 h-8 flex items-center justify-center">
                        <X className="h-4 w-4" />
                      </div>
                      <div className="text-xs text-gray-500">Missed Payments</div>
                      <div className="text-lg font-semibold text-red-600 mt-1">
                        {partnerRisks.reduce((sum, p) => sum + p.paymentHistory.missedPayments, 0)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Partners with Payment Issues</h4>
                  {partnerRisks
                    .filter(p => p.paymentHistory.latePayments > 0 || p.paymentHistory.missedPayments > 0)
                    .sort((a, b) => 
                      (b.paymentHistory.missedPayments * 3 + b.paymentHistory.latePayments) - 
                      (a.paymentHistory.missedPayments * 3 + a.paymentHistory.latePayments)
                    )
                    .slice(0, 3)
                    .map(partner => (
                      <div 
                        key={partner.partnerId} 
                        className="flex justify-between items-center p-2 border-b last:border-0"
                      >
                        <div>
                          <div className="font-medium">{partner.partnerName}</div>
                          <div className="text-xs text-gray-500">{partner.country}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {partner.paymentHistory.missedPayments > 0 && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {partner.paymentHistory.missedPayments} Missed
                            </Badge>
                          )}
                          {partner.paymentHistory.latePayments > 0 && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              {partner.paymentHistory.latePayments} Late
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    
                  {partnerRisks.filter(p => p.paymentHistory.latePayments > 0 || p.paymentHistory.missedPayments > 0).length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No partners with payment issues
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="partners" className="space-y-4 mt-4">
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  Trading Partners
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
                    variant={sortBy === 'name' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleSort('name')}
                    className="hidden sm:flex items-center"
                  >
                    Name
                    {sortBy === 'name' && (
                      sortDir === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />
                    )}
                  </Button>
                  
                  <Button 
                    variant={sortBy === 'creditScore' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleSort('creditScore')}
                    className="hidden sm:flex items-center"
                  >
                    Credit Score
                    {sortBy === 'creditScore' && (
                      sortDir === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {/* Filters section */}
            {showFilters && (
              <CardContent className="border-b pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Search Partners</label>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search by name or country..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Risk Level</label>
                    <Select 
                      value={riskLevelFilter} 
                      onValueChange={(value: any) => setRiskLevelFilter(value)}
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
                </div>
                
                <div className="flex justify-between mt-3">
                  <div className="text-xs text-gray-500">
                    Showing {filteredPartners.length} of {partnerRisks.length} partners
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            )}
            
            <CardContent className="pt-4">
              {sortedPartners.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
                  <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Partners Found</h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    No partners match your current filter criteria. Try adjusting your filters or expanding your search.
                  </p>
                  <Button className="mt-4" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b text-left">
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Partner</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Score</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment History</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Trade Volume</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Transaction</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Relationship</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Flags</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {sortedPartners.map(partner => {
                        const color = getRiskLevelColor(partner.riskLevel);
                        const creditColor = getCreditScoreColor(partner.creditScore);
                        
                        return (
                          <tr 
                            key={partner.partnerId} 
                            className={`hover:bg-gray-50 ${selectedPartner?.partnerId === partner.partnerId ? 'bg-primary/5' : ''}`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                <div>
                                  <div className="font-medium">{partner.partnerName}</div>
                                  <div className="text-xs text-gray-500">{partner.country}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge 
                                className={`bg-${color}-100 text-${color}-700 border-${color}-200`}
                              >
                                {partner.riskLevel}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <Progress 
                                  value={partner.creditScore} 
                                  className="w-16 h-1.5 mr-2"
                                  indicatorClassName={`bg-${creditColor}-500`}
                                />
                                <span className="text-sm font-medium">{partner.creditScore}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-1 text-xs">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  {partner.paymentHistory.onTimePayments} On-time
                                </Badge>
                                {partner.paymentHistory.latePayments > 0 && (
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                    {partner.paymentHistory.latePayments} Late
                                  </Badge>
                                )}
                                {partner.paymentHistory.missedPayments > 0 && (
                                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    {partner.paymentHistory.missedPayments} Missed
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">
                              ${partner.totalTradeVolume.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              ${partner.avgTransactionSize.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {partner.relationshipYears} year{partner.relationshipYears !== 1 ? 's' : ''}
                            </td>
                            <td className="px-4 py-3">
                              {partner.recentFlags.length > 0 ? (
                                <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50">
                                  {partner.recentFlags.length} flag{partner.recentFlags.length !== 1 ? 's' : ''}
                                </Badge>
                              ) : (
                                <span className="text-sm text-gray-500">None</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setSelectedPartner(
                                  selectedPartner?.partnerId === partner.partnerId ? null : partner
                                )}
                                className="h-7 px-2"
                              >
                                <ArrowUpRight className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
          
          {selectedPartner && (
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 text-primary mr-2" />
                      {selectedPartner.partnerName} Risk Profile
                    </CardTitle>
                    <CardDescription>
                      {selectedPartner.country} | {selectedPartner.relationshipYears} year{selectedPartner.relationshipYears !== 1 ? 's' : ''} relationship
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedPartner(null)}
                  >
                    &times;
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    {/* Credit score indicator */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium">Credit Score</div>
                        <Badge 
                          className={`bg-${getRiskLevelColor(selectedPartner.riskLevel)}-100 text-${getRiskLevelColor(selectedPartner.riskLevel)}-700 border-${getRiskLevelColor(selectedPartner.riskLevel)}-200`}
                        >
                          {selectedPartner.riskLevel}
                        </Badge>
                      </div>
                      <Progress 
                        value={selectedPartner.creditScore} 
                        className="h-2.5"
                        indicatorClassName={`bg-${getCreditScoreColor(selectedPartner.creditScore)}-500`}
                      />
                      <div className="flex justify-end mt-1 text-sm font-medium">
                        {selectedPartner.creditScore}%
                      </div>
                    </div>
                    
                    {/* Payment history breakdown */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Payment History</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white rounded-lg border shadow-sm p-3 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedPartner.paymentHistory.onTimePayments}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">On-time</div>
                        </div>
                        <div className="bg-white rounded-lg border shadow-sm p-3 text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {selectedPartner.paymentHistory.latePayments}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Late</div>
                        </div>
                        <div className="bg-white rounded-lg border shadow-sm p-3 text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {selectedPartner.paymentHistory.missedPayments}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Missed</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Trade statistics */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Trade Statistics</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm">Total Trade Volume</span>
                          </div>
                          <span className="font-medium">${selectedPartner.totalTradeVolume.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <BarChart className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm">Average Transaction</span>
                          </div>
                          <span className="font-medium">${selectedPartner.avgTransactionSize.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm">Open Contracts</span>
                          </div>
                          <span className="font-medium">3</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm">Relationship Started</span>
                          </div>
                          <span className="font-medium">{new Date().getFullYear() - selectedPartner.relationshipYears}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Recent flags */}
                    {selectedPartner.recentFlags.length > 0 && (
                      <Card className="border-l-4 border-l-amber-500">
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-base flex items-center">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                            Recent Flags
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-0 px-4">
                          <ul className="space-y-2 text-sm">
                            {selectedPartner.recentFlags.map((flag, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-amber-600 mr-2">•</span>
                                <span>{flag}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Risk mitigation recommendations */}
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base flex items-center">
                          <Shield className="h-4 w-4 text-primary mr-2" />
                          Risk Mitigation Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-0 px-4">
                        <ul className="space-y-2 text-sm">
                          {selectedPartner.riskLevel !== RiskLevel.LOW && (
                            <>
                              <li className="flex items-start">
                                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                <span>Implement credit limits appropriate for the {selectedPartner.creditScore}% credit score.</span>
                              </li>
                              <li className="flex items-start">
                                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                <span>Require secured payment methods for all transactions.</span>
                              </li>
                              <li className="flex items-start">
                                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                <span>Schedule quarterly credit reviews due to the {selectedPartner.riskLevel.toLowerCase()} risk level.</span>
                              </li>
                            </>
                          )}
                          
                          {selectedPartner.paymentHistory.latePayments > 0 && (
                            <li className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span>Consider implementing early payment incentives to improve payment timeline.</span>
                            </li>
                          )}
                          
                          {selectedPartner.paymentHistory.missedPayments > 0 && (
                            <li className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span>Require advance payment or Letter of Credit for all future transactions.</span>
                            </li>
                          )}
                          
                          {selectedPartner.riskLevel === RiskLevel.LOW && selectedPartner.paymentHistory.missedPayments === 0 && (
                            <li className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span>Partner represents low risk - consider offering preferential trade terms.</span>
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <Button className="flex-1">Generate Full Report</Button>
                      <Button variant="outline" className="flex-1">View Transaction History</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-4 mt-4">
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 text-primary mr-2" />
                Risk Distribution Analysis
              </CardTitle>
              <CardDescription>
                Overview of partner risk factors and distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center p-6 bg-gray-50 rounded-lg border mb-4 h-64 relative">
                {/* This is a placeholder for a real interactive chart */}
                <div className="text-center">
                  <PieChart className="mx-auto h-12 w-12 text-primary/30 mb-3" />
                  <p className="text-gray-500">Risk factor distribution chart would render here</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Showing distribution of {partnerRisks.length} partners by risk category
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-3">Risk Level Distribution</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                          <span>Critical Risk</span>
                        </div>
                        <span>
                          {partnersByRiskLevel[RiskLevel.CRITICAL].length} 
                          ({partnerRisks.length ? ((partnersByRiskLevel[RiskLevel.CRITICAL].length / partnerRisks.length) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                      <Progress 
                        value={partnerRisks.length ? (partnersByRiskLevel[RiskLevel.CRITICAL].length / partnerRisks.length) * 100 : 0} 
                        className="h-2"
                        indicatorClassName="bg-red-500"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                          <span>High Risk</span>
                        </div>
                        <span>
                          {partnersByRiskLevel[RiskLevel.HIGH].length}
                          ({partnerRisks.length ? ((partnersByRiskLevel[RiskLevel.HIGH].length / partnerRisks.length) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                      <Progress 
                        value={partnerRisks.length ? (partnersByRiskLevel[RiskLevel.HIGH].length / partnerRisks.length) * 100 : 0} 
                        className="h-2"
                        indicatorClassName="bg-orange-500"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                          <span>Medium Risk</span>
                        </div>
                        <span>
                          {partnersByRiskLevel[RiskLevel.MEDIUM].length}
                          ({partnerRisks.length ? ((partnersByRiskLevel[RiskLevel.MEDIUM].length / partnerRisks.length) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                      <Progress 
                        value={partnerRisks.length ? (partnersByRiskLevel[RiskLevel.MEDIUM].length / partnerRisks.length) * 100 : 0} 
                        className="h-2"
                        indicatorClassName="bg-yellow-500"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                          <span>Low Risk</span>
                        </div>
                        <span>
                          {partnersByRiskLevel[RiskLevel.LOW].length}
                          ({partnerRisks.length ? ((partnersByRiskLevel[RiskLevel.LOW].length / partnerRisks.length) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                      <Progress 
                        value={partnerRisks.length ? (partnersByRiskLevel[RiskLevel.LOW].length / partnerRisks.length) * 100 : 0} 
                        className="h-2"
                        indicatorClassName="bg-green-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Credit Score Distribution</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                          <span>Excellent (80-100%)</span>
                        </div>
                        <span>
                          {partnerRisks.filter(p => p.creditScore >= 80).length}
                          ({partnerRisks.length ? ((partnerRisks.filter(p => p.creditScore >= 80).length / partnerRisks.length) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                      <Progress 
                        value={partnerRisks.length ? (partnerRisks.filter(p => p.creditScore >= 80).length / partnerRisks.length) * 100 : 0} 
                        className="h-2"
                        indicatorClassName="bg-green-500"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-lime-500 mr-1"></div>
                          <span>Good (60-79%)</span>
                        </div>
                        <span>
                          {partnerRisks.filter(p => p.creditScore >= 60 && p.creditScore < 80).length}
                          ({partnerRisks.length ? ((partnerRisks.filter(p => p.creditScore >= 60 && p.creditScore < 80).length / partnerRisks.length) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                      <Progress 
                        value={partnerRisks.length ? (partnerRisks.filter(p => p.creditScore >= 60 && p.creditScore < 80).length / partnerRisks.length) * 100 : 0} 
                        className="h-2"
                        indicatorClassName="bg-lime-500"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                          <span>Fair (40-59%)</span>
                        </div>
                        <span>
                          {partnerRisks.filter(p => p.creditScore >= 40 && p.creditScore < 60).length}
                          ({partnerRisks.length ? ((partnerRisks.filter(p => p.creditScore >= 40 && p.creditScore < 60).length / partnerRisks.length) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                      <Progress 
                        value={partnerRisks.length ? (partnerRisks.filter(p => p.creditScore >= 40 && p.creditScore < 60).length / partnerRisks.length) * 100 : 0} 
                        className="h-2"
                        indicatorClassName="bg-yellow-500"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                          <span>Poor (20-39%)</span>
                        </div>
                        <span>
                          {partnerRisks.filter(p => p.creditScore >= 20 && p.creditScore < 40).length}
                          ({partnerRisks.length ? ((partnerRisks.filter(p => p.creditScore >= 20 && p.creditScore < 40).length / partnerRisks.length) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                      <Progress 
                        value={partnerRisks.length ? (partnerRisks.filter(p => p.creditScore >= 20 && p.creditScore < 40).length / partnerRisks.length) * 100 : 0} 
                        className="h-2"
                        indicatorClassName="bg-orange-500"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                          <span>Very Poor (0-19%)</span>
                        </div>
                        <span>
                          {partnerRisks.filter(p => p.creditScore < 20).length}
                          ({partnerRisks.length ? ((partnerRisks.filter(p => p.creditScore < 20).length / partnerRisks.length) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                      <Progress 
                        value={partnerRisks.length ? (partnerRisks.filter(p => p.creditScore < 20).length / partnerRisks.length) * 100 : 0} 
                        className="h-2"
                        indicatorClassName="bg-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="w-full">
                Generate Comprehensive Risk Analysis Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnerRiskTable;