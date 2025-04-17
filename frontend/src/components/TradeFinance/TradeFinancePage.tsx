import React, { useState } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useTradeFinance } from '@/hooks/useTradeFinance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, AlertCircle, Calendar, FileText, CreditCard, AlertTriangle, 
  Check, Clock, ArrowRight, Globe, Briefcase, DollarSign, FileQuestion
} from 'lucide-react';
import { format } from 'date-fns';

// Format currency helper
const formatCurrency = (amount: string | number, currency: string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency, 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
};

// Helper to show application type in a more readable format
const formatApplicationType = (type: string) => {
  switch(type) {
    case 'LETTER_OF_CREDIT':
      return 'Letter of Credit';
    case 'BANK_GUARANTEE':
      return 'Bank Guarantee';
    case 'FACTORING':
      return 'Factoring';
    default:
      return type;
  }
};

// Helper to show application status badge
const ApplicationStatusBadge = ({ status }: { status: string }) => {
  switch(status) {
    case 'APPROVED':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
    case 'REJECTED':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
    case 'PROCESSING':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>;
    case 'PENDING':
    default:
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
  }
};

// Application card component
const ApplicationCard = ({ application, onView }: any) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{formatApplicationType(application.applicationType)}</CardTitle>
            <ApplicationStatusBadge status={application.status} />
          </div>
          <div className="text-sm text-muted-foreground">
            {format(new Date(application.applicationDate), 'MMM d, yyyy')}
          </div>
        </div>
        <CardDescription>
          Contract ID: {application.contractId || 'Not specified'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-xl font-bold">{formatCurrency(application.amount, application.currency)}</p>
          </div>
          {application.expiryDate && (
            <div>
              <p className="text-sm text-muted-foreground">Expiry Date</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <p className="text-sm">
                  {format(new Date(application.expiryDate), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onView(application.id)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

// Application detail component
const ApplicationDetail = ({ application, onClose }: any) => {
  if (!application) return null;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{formatApplicationType(application.applicationType)}</h2>
          <div className="flex items-center mt-1 space-x-2">
            <p className="text-muted-foreground">Status:</p>
            <ApplicationStatusBadge status={application.status} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Application Date</p>
          <p>{format(new Date(application.applicationDate), 'MMMM d, yyyy')}</p>
          
          {application.approvalDate && (
            <>
              <p className="text-sm text-muted-foreground mt-2">Approval Date</p>
              <p>{format(new Date(application.approvalDate), 'MMMM d, yyyy')}</p>
            </>
          )}
          
          {application.expiryDate && (
            <>
              <p className="text-sm text-muted-foreground mt-2">Expiry Date</p>
              <p>{format(new Date(application.expiryDate), 'MMMM d, yyyy')}</p>
            </>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="font-medium mb-1">Applicant</p>
          <p>User ID: {application.userId}</p>
        </div>
        {application.contractId && (
          <div>
            <p className="font-medium mb-1">Related Contract</p>
            <p>Contract ID: {application.contractId}</p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-muted rounded-md">
        <h3 className="font-medium mb-3">Application Details</h3>
        <div className="grid gap-4">
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-medium">{formatCurrency(application.amount, application.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>Currency:</span>
            <span className="font-medium">{application.currency}</span>
          </div>
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="font-medium">{formatApplicationType(application.applicationType)}</span>
          </div>
        </div>
      </div>
      
      {application.terms && (
        <div>
          <h3 className="font-medium mb-2">Terms and Conditions</h3>
          <div className="border rounded-md p-4">
            {Object.entries(application.terms).map(([key, value]: [string, any]) => (
              <div key={key} className="mb-2">
                <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                <p className="text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {application.supportingDocuments && application.supportingDocuments.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Supporting Documents</h3>
          <div className="border rounded-md p-4">
            <ul className="space-y-2">
              {application.supportingDocuments.map((doc: string, index: number) => (
                <li key={index} className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

// Application form for creating new trade finance applications
const ApplicationForm = ({ onSubmit, onCancel }: any) => {
  const [formData, setFormData] = useState({
    applicationType: 'LETTER_OF_CREDIT',
    amount: '',
    currency: 'USD',
    contractId: '',
    expiryDate: format(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 90 days from now
    terms: {
      beneficiary: '',
      issuingBank: '',
      applicableRules: 'UCP 600',
      partialShipment: 'Not Allowed',
      transferable: 'No'
    },
    supportingDocuments: [] as string[]
  });
  
  const applicationTypes = [
    { value: 'LETTER_OF_CREDIT', label: 'Letter of Credit' },
    { value: 'BANK_GUARANTEE', label: 'Bank Guarantee' },
    { value: 'FACTORING', label: 'Factoring' }
  ];
  
  const handleTermChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      terms: {
        ...formData.terms,
        [key]: value
      }
    });
  };
  
  const handleAddDocument = () => {
    setFormData({
      ...formData,
      supportingDocuments: [...formData.supportingDocuments, '']
    });
  };
  
  const handleDocumentChange = (index: number, value: string) => {
    const newDocs = [...formData.supportingDocuments];
    newDocs[index] = value;
    setFormData({
      ...formData,
      supportingDocuments: newDocs
    });
  };
  
  const handleRemoveDocument = (index: number) => {
    const newDocs = [...formData.supportingDocuments];
    newDocs.splice(index, 1);
    setFormData({
      ...formData,
      supportingDocuments: newDocs
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: formData.amount,
      contractId: formData.contractId ? parseInt(formData.contractId) : undefined,
      expiryDate: new Date(formData.expiryDate)
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="applicationType">Application Type</Label>
          <select
            id="applicationType"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.applicationType}
            onChange={(e) => setFormData({...formData, applicationType: e.target.value})}
          >
            {applicationTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contractId">Contract ID (Optional)</Label>
          <Input 
            id="contractId" 
            type="number"
            placeholder="Related contract ID"
            value={formData.contractId}
            onChange={(e) => setFormData({...formData, contractId: e.target.value})}
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input 
              id="amount" 
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.currency}
            onChange={(e) => setFormData({...formData, currency: e.target.value})}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="CNY">CNY - Chinese Yuan</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="expiryDate">Expiry Date</Label>
        <Input 
          id="expiryDate" 
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
          required
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Terms & Conditions</h3>
        <div className="space-y-4 border rounded-lg p-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="beneficiary">Beneficiary</Label>
              <Input 
                id="beneficiary" 
                placeholder="Beneficiary name/ID"
                value={formData.terms.beneficiary}
                onChange={(e) => handleTermChange('beneficiary', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issuingBank">Issuing Bank</Label>
              <Input 
                id="issuingBank" 
                placeholder="Bank name"
                value={formData.terms.issuingBank}
                onChange={(e) => handleTermChange('issuingBank', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicableRules">Applicable Rules</Label>
              <select
                id="applicableRules"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.terms.applicableRules}
                onChange={(e) => handleTermChange('applicableRules', e.target.value)}
              >
                <option value="UCP 600">UCP 600</option>
                <option value="ISP 98">ISP 98</option>
                <option value="URDG 758">URDG 758</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="partialShipment">Partial Shipment</Label>
              <select
                id="partialShipment"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.terms.partialShipment}
                onChange={(e) => handleTermChange('partialShipment', e.target.value)}
              >
                <option value="Allowed">Allowed</option>
                <option value="Not Allowed">Not Allowed</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transferable">Transferable</Label>
              <select
                id="transferable"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.terms.transferable}
                onChange={(e) => handleTermChange('transferable', e.target.value)}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Supporting Documents</h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddDocument}>
            <Plus className="h-4 w-4 mr-1" />
            Add Document
          </Button>
        </div>
        
        {formData.supportingDocuments.length === 0 ? (
          <div className="border rounded-lg p-6 text-center text-muted-foreground">
            <FileQuestion className="h-8 w-8 mx-auto mb-2" />
            <p>No supporting documents added yet</p>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleAddDocument}>
              Add Document
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.supportingDocuments.map((doc, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input 
                  placeholder="Document title or description"
                  value={doc}
                  onChange={(e) => handleDocumentChange(index, e.target.value)}
                  required
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  className="px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemoveDocument(index)}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Submit Application
        </Button>
      </div>
    </form>
  );
};

const NoApplicationsAlert = () => (
  <Alert className="mb-6">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>No trade finance applications</AlertTitle>
    <AlertDescription>
      You haven't submitted any trade finance applications yet.
    </AlertDescription>
  </Alert>
);

const TradeFinancePage = () => {
  const { user, isLoggedIn } = useWeb3();
  const { 
    applications, application, 
    isLoadingApplications, isLoadingApplication,
    createApplicationMutation, 
  } = useTradeFinance();
  
  const [createMode, setCreateMode] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
  
  const handleViewApplication = (applicationId: number) => {
    setSelectedApplicationId(applicationId);
  };
  
  const handleCloseApplication = () => {
    setSelectedApplicationId(null);
  };
  
  const handleCreateApplication = (applicationData: any) => {
    // Add user ID to the application data
    const data = {
      ...applicationData,
      userId: user?.id
    };
    
    createApplicationMutation.mutate(data);
    setCreateMode(false);
  };
  
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trade Finance</h1>
          <p className="text-muted-foreground">Apply for trade finance instruments</p>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              Please login to access trade finance features.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.location.href = '/'}>Go to Login</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Display application detail view if an application is selected
  if (selectedApplicationId && application && !createMode) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Application Details</h1>
            <p className="text-muted-foreground">View your trade finance application</p>
          </div>
          <Button variant="ghost" onClick={handleCloseApplication}>
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Applications
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <ApplicationDetail 
              application={application} 
              onClose={handleCloseApplication} 
            />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Display application form
  if (createMode) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">New Application</h1>
            <p className="text-muted-foreground">Apply for trade finance</p>
          </div>
          <Button variant="ghost" onClick={() => setCreateMode(false)}>
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Applications
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <ApplicationForm 
              onSubmit={handleCreateApplication}
              onCancel={() => setCreateMode(false)}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Main applications list view
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trade Finance</h1>
          <p className="text-muted-foreground">Access trade finance instruments for your international trade</p>
        </div>
        <Button onClick={() => setCreateMode(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Trade Finance Instruments</CardTitle>
            <CardDescription>Financial tools to secure and facilitate international trade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Letter of Credit</h3>
                <p className="text-sm text-muted-foreground">A bank guarantee that ensures sellers receive payment once they fulfill the terms of the agreement.</p>
                <Button className="mt-4" variant="outline" size="sm" onClick={() => setCreateMode(true)}>Apply Now</Button>
              </div>
              
              <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Bank Guarantee</h3>
                <p className="text-sm text-muted-foreground">A promise from a bank ensuring that the liabilities of a debtor will be met in case of default.</p>
                <Button className="mt-4" variant="outline" size="sm" onClick={() => setCreateMode(true)}>Apply Now</Button>
              </div>
              
              <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Factoring</h3>
                <p className="text-sm text-muted-foreground">A financial transaction where a business sells its accounts receivable to a third party at a discount.</p>
                <Button className="mt-4" variant="outline" size="sm" onClick={() => setCreateMode(true)}>Apply Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Applications</h2>
        
        {isLoadingApplications ? (
          <p>Loading your applications...</p>
        ) : (
          <>
            {(!applications || applications.length === 0) ? (
              <NoApplicationsAlert />
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {applications.map((app: any) => (
                  <ApplicationCard 
                    key={app.id} 
                    application={app} 
                    onView={handleViewApplication}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TradeFinancePage;