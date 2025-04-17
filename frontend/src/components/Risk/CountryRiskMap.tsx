import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Globe,
  AlertTriangle,
  Search,
  SortAsc,
  SortDesc,
  MapPin,
  Flag,
  TrendingDown,
  TrendingUp,
  Filter,
  ChevronUp,
  ChevronDown,
  Info,
  MapIcon,
  BarChart,
  ArrowRight,
  Check
} from 'lucide-react';
import { CountryRisk, RiskLevel } from '@/types/risk';

interface CountryRiskMapProps {
  countryRisks: CountryRisk[];
}

const CountryRiskMap: React.FC<CountryRiskMapProps> = ({ countryRisks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'country' | 'overallRiskScore'>('overallRiskScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<RiskLevel | 'all'>('all');
  const [selectedCountry, setSelectedCountry] = useState<CountryRisk | null>(null);
  
  // Filter countries based on search term and risk level
  const filteredCountries = countryRisks.filter(country => {
    const matchesSearch = country.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRiskLevel = selectedRiskLevel === 'all' || country.riskLevel === selectedRiskLevel;
    
    return matchesSearch && matchesRiskLevel;
  });
  
  // Sort filtered countries
  const sortedCountries = [...filteredCountries].sort((a, b) => {
    if (sortBy === 'country') {
      return sortDir === 'asc' 
        ? a.country.localeCompare(b.country) 
        : b.country.localeCompare(a.country);
    }
    
    if (sortBy === 'overallRiskScore') {
      return sortDir === 'asc' 
        ? a.overallRiskScore - b.overallRiskScore 
        : b.overallRiskScore - a.overallRiskScore;
    }
    
    return 0;
  });
  
  // Toggle sort direction when clicking on the same sort field
  const handleSort = (field: 'country' | 'overallRiskScore') => {
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
    setSelectedRiskLevel('all');
    setSortBy('overallRiskScore');
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
  
  // Group countries by risk level for summary
  const countriesByRiskLevel = {
    [RiskLevel.LOW]: countryRisks.filter(c => c.riskLevel === RiskLevel.LOW),
    [RiskLevel.MEDIUM]: countryRisks.filter(c => c.riskLevel === RiskLevel.MEDIUM),
    [RiskLevel.HIGH]: countryRisks.filter(c => c.riskLevel === RiskLevel.HIGH),
    [RiskLevel.CRITICAL]: countryRisks.filter(c => c.riskLevel === RiskLevel.CRITICAL),
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-md overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <MapIcon className="h-5 w-5 text-primary mr-2" />
              Global Risk Map
            </CardTitle>
            <CardDescription>
              Geopolitical and economic risk assessment by country
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-center items-center p-4 bg-gray-50 rounded-lg border mb-4 h-[260px] relative">
              {/* This is a placeholder for a real interactive map */}
              <div className="text-center">
                <Globe className="mx-auto h-12 w-12 text-primary/30 mb-3" />
                <p className="text-gray-500">Interactive risk map would be rendered here</p>
                <p className="text-xs text-gray-400 mt-1">
                  Countries color-coded by risk level: {countryRisks.length} countries analyzed
                </p>
              </div>
              
              {/* Risk level indicators */}
              <div className="absolute bottom-3 right-3 flex flex-col space-y-1 bg-white/80 p-2 rounded-md shadow-sm">
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  <span>Critical Risk ({countriesByRiskLevel[RiskLevel.CRITICAL].length})</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                  <span>High Risk ({countriesByRiskLevel[RiskLevel.HIGH].length})</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span>Medium Risk ({countriesByRiskLevel[RiskLevel.MEDIUM].length})</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span>Low Risk ({countriesByRiskLevel[RiskLevel.LOW].length})</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Top risk countries summary */}
              <h4 className="text-sm font-medium text-gray-700">Top Risk Countries</h4>
              <div className="space-y-2">
                {countryRisks
                  .sort((a, b) => b.overallRiskScore - a.overallRiskScore)
                  .slice(0, 3)
                  .map(country => {
                    const color = getRiskLevelColor(country.riskLevel);
                    
                    return (
                      <div 
                        key={country.iso} 
                        className="bg-white p-3 rounded-lg border shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setSelectedCountry(country)}
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full bg-${color}-50 text-${color}-500 mr-3`}>
                            <Flag className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">{country.country}</h4>
                            <p className="text-xs text-gray-500">
                              {country.tradeRestrictions.length > 0 
                                ? country.tradeRestrictions[0] 
                                : 'No active restrictions'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className={`bg-${color}-100 text-${color}-700 border-${color}-200 mb-1`}
                          >
                            {country.riskLevel}
                          </Badge>
                          <div className="text-sm font-medium">
                            {country.overallRiskScore.toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="text-xs text-gray-500">
              Data last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              View Full Report <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Country details or stats card */}
        {selectedCountry ? (
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    {selectedCountry.country} Risk Profile
                  </CardTitle>
                  <CardDescription>
                    ISO: {selectedCountry.iso} | Trading Partners: {selectedCountry.tradingPartnerCount}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedCountry(null)}
                >
                  &times;
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {/* Risk score indicator */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-medium">Overall Risk Score</div>
                    <Badge 
                      className={`bg-${getRiskLevelColor(selectedCountry.riskLevel)}-100 text-${getRiskLevelColor(selectedCountry.riskLevel)}-700 border-${getRiskLevelColor(selectedCountry.riskLevel)}-200`}
                    >
                      {selectedCountry.riskLevel}
                    </Badge>
                  </div>
                  <Progress 
                    value={selectedCountry.overallRiskScore} 
                    className="h-2.5"
                    indicatorClassName={`bg-${getRiskLevelColor(selectedCountry.riskLevel)}-500`}
                  />
                  <div className="flex justify-end mt-1 text-sm font-medium">
                    {selectedCountry.overallRiskScore.toFixed(0)}%
                  </div>
                </div>
                
                {/* Risk factors breakdown */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm">Political Stability</div>
                      <div className="text-sm font-medium">{selectedCountry.politicalStabilityScore.toFixed(0)}%</div>
                    </div>
                    <Progress 
                      value={selectedCountry.politicalStabilityScore} 
                      className="h-1.5"
                      indicatorClassName={selectedCountry.politicalStabilityScore > 60 ? 'bg-green-500' : 'bg-orange-500'}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm">Economic Stability</div>
                      <div className="text-sm font-medium">{selectedCountry.economicStabilityScore.toFixed(0)}%</div>
                    </div>
                    <Progress 
                      value={selectedCountry.economicStabilityScore} 
                      className="h-1.5"
                      indicatorClassName={selectedCountry.economicStabilityScore > 60 ? 'bg-green-500' : 'bg-orange-500'}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm">Regulatory Quality</div>
                      <div className="text-sm font-medium">{selectedCountry.regulatoryQualityScore.toFixed(0)}%</div>
                    </div>
                    <Progress 
                      value={selectedCountry.regulatoryQualityScore} 
                      className="h-1.5"
                      indicatorClassName={selectedCountry.regulatoryQualityScore > 60 ? 'bg-green-500' : 'bg-orange-500'}
                    />
                  </div>
                </div>
                
                {/* Trade restrictions */}
                {selectedCountry.tradeRestrictions.length > 0 && (
                  <Card className={`border-l-4 border-l-${getRiskLevelColor(selectedCountry.riskLevel)}-500 bg-gray-50`}>
                    <CardContent className="p-3 space-y-1">
                      <h4 className="font-medium flex items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                        Trade Restrictions
                      </h4>
                      <ul className="text-sm space-y-1">
                        {selectedCountry.tradeRestrictions.map((restriction, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>{restriction}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                {/* Key recommendations */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 text-primary mr-1" />
                    Key Recommendations
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-green-50 text-green-600 mr-2 mt-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>Consider requiring Letter of Credit for all transactions in this region.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-green-50 text-green-600 mr-2 mt-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>Implement additional due diligence for partners in this country.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-green-50 text-green-600 mr-2 mt-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>Monitor currency fluctuations closely for impact on contracts.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="w-full">
                Generate Detailed Country Report
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 text-primary mr-2" />
                Country Risk Statistics
              </CardTitle>
              <CardDescription>
                Regional analysis and risk breakdown
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Countries Analyzed</p>
                        <h4 className="text-2xl font-bold mt-1">{countryRisks.length}</h4>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Globe className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Avg Risk Score</p>
                        <h4 className="text-2xl font-bold mt-1">
                          {countryRisks.length > 0
                            ? (countryRisks.reduce((sum, c) => sum + c.overallRiskScore, 0) / countryRisks.length).toFixed(1)
                            : 0}%
                        </h4>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-full text-amber-500">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Risk Level Distribution</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                        <span>Critical Risk</span>
                      </div>
                      <span>{countriesByRiskLevel[RiskLevel.CRITICAL].length} countries</span>
                    </div>
                    <Progress 
                      value={countriesByRiskLevel[RiskLevel.CRITICAL].length / countryRisks.length * 100} 
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
                      <span>{countriesByRiskLevel[RiskLevel.HIGH].length} countries</span>
                    </div>
                    <Progress 
                      value={countriesByRiskLevel[RiskLevel.HIGH].length / countryRisks.length * 100} 
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
                      <span>{countriesByRiskLevel[RiskLevel.MEDIUM].length} countries</span>
                    </div>
                    <Progress 
                      value={countriesByRiskLevel[RiskLevel.MEDIUM].length / countryRisks.length * 100} 
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
                      <span>{countriesByRiskLevel[RiskLevel.LOW].length} countries</span>
                    </div>
                    <Progress 
                      value={countriesByRiskLevel[RiskLevel.LOW].length / countryRisks.length * 100} 
                      className="h-2"
                      indicatorClassName="bg-green-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Click on a country from the list below to view detailed risk assessment
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 text-primary mr-2" />
              Country Risk Database
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
                variant={sortBy === 'country' ? "default" : "outline"} 
                size="sm"
                onClick={() => handleSort('country')}
                className="hidden sm:flex items-center"
              >
                Country
                {sortBy === 'country' && (
                  sortDir === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />
                )}
              </Button>
              
              <Button 
                variant={sortBy === 'overallRiskScore' ? "default" : "outline"} 
                size="sm"
                onClick={() => handleSort('overallRiskScore')}
                className="hidden sm:flex items-center"
              >
                Risk Score
                {sortBy === 'overallRiskScore' && (
                  sortDir === 'asc' ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Filters section */}
        {showFilters && (
          <CardContent className="border-b pb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="space-y-1 flex-1">
                <label className="text-sm font-medium">Search Countries</label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by country name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Risk Level</label>
                <div className="flex space-x-1">
                  <Button 
                    variant={selectedRiskLevel === 'all' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedRiskLevel('all')}
                  >
                    All
                  </Button>
                  <Button 
                    variant={selectedRiskLevel === RiskLevel.LOW ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedRiskLevel(RiskLevel.LOW)}
                    className="text-green-600"
                  >
                    Low
                  </Button>
                  <Button 
                    variant={selectedRiskLevel === RiskLevel.MEDIUM ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedRiskLevel(RiskLevel.MEDIUM)}
                    className="text-yellow-600"
                  >
                    Medium
                  </Button>
                  <Button 
                    variant={selectedRiskLevel === RiskLevel.HIGH ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedRiskLevel(RiskLevel.HIGH)}
                    className="text-orange-600"
                  >
                    High
                  </Button>
                  <Button 
                    variant={selectedRiskLevel === RiskLevel.CRITICAL ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedRiskLevel(RiskLevel.CRITICAL)}
                    className="text-red-600"
                  >
                    Critical
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-3">
              <div className="text-xs text-gray-500">
                Showing {filteredCountries.length} of {countryRisks.length} countries
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
          {sortedCountries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
              <Globe className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Countries Found</h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                No countries match your current filter criteria. Try adjusting your filters or expanding your search.
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
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Score</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Political</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Economic</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Regulatory</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Trading Partners</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Restrictions</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedCountries.map(country => {
                    const color = getRiskLevelColor(country.riskLevel);
                    
                    return (
                      <tr 
                        key={country.iso} 
                        className={`hover:bg-gray-50 ${selectedCountry?.iso === country.iso ? 'bg-primary/5' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium">{country.country}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge 
                            className={`bg-${color}-100 text-${color}-700 border-${color}-200`}
                          >
                            {country.riskLevel}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Progress 
                              value={country.overallRiskScore} 
                              className="w-24 h-1.5 mr-2"
                              indicatorClassName={`bg-${color}-500`}
                            />
                            <span className="text-sm font-medium">{country.overallRiskScore.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{country.politicalStabilityScore.toFixed(0)}%</td>
                        <td className="px-4 py-3 text-sm">{country.economicStabilityScore.toFixed(0)}%</td>
                        <td className="px-4 py-3 text-sm">{country.regulatoryQualityScore.toFixed(0)}%</td>
                        <td className="px-4 py-3 text-sm">{country.tradingPartnerCount}</td>
                        <td className="px-4 py-3">
                          {country.tradeRestrictions.length > 0 ? (
                            <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50">
                              {country.tradeRestrictions.length} restriction{country.tradeRestrictions.length !== 1 ? 's' : ''}
                            </Badge>
                          ) : (
                            <span className="text-sm text-gray-500">None</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedCountry(country)}
                            className="h-7 px-2"
                          >
                            {selectedCountry?.iso === country.iso ? 'Hide' : 'View'}
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
    </div>
  );
};

export default CountryRiskMap;