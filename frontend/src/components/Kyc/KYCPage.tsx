import React, { useState } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useKYC, KYCStatus } from '@/hooks/useKYC';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertCircle, CheckCircle, User, Building, FileText, 
  Shield, ShieldCheck, ShieldX, UserCheck, Clock, Lock, Info
} from 'lucide-react';

// KYC Status Badge component
const KYCStatusBadge = ({ status }: { status: string }) => {
  switch(status) {
    case KYCStatus.VERIFIED:
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    case KYCStatus.REJECTED:
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <ShieldX className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    case KYCStatus.PENDING:
    default:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
  }
};

// Risk Score component
const RiskScore = ({ score }: { score: number }) => {
  let color = 'bg-green-500';
  let label = 'Low Risk';
  
  if (score > 70) {
    color = 'bg-red-500';
    label = 'High Risk';
  } else if (score > 30) {
    color = 'bg-yellow-500';
    label = 'Medium Risk';
  }
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <p className="text-sm font-medium">Risk Score</p>
        <p className="text-sm font-medium">{score}/100</p>
      </div>
      <Progress value={score} className={color} />
      <p className="text-xs text-right">{label}</p>
    </div>
  );
};

// KYC Individual Form component
const KYCIndividualForm = ({ onSubmit, existingData = {} }: any) => {
  const [formData, setFormData] = useState({
    firstName: existingData.firstName || '',
    lastName: existingData.lastName || '',
    dateOfBirth: existingData.dateOfBirth || '',
    nationality: existingData.nationality || '',
    residenceCountry: existingData.residenceCountry || '',
    idType: existingData.idType || 'passport',
    idNumber: existingData.idNumber || '',
    idExpiryDate: existingData.idExpiryDate || '',
    taxIdNumber: existingData.taxIdNumber || '',
    contactDetails: {
      email: existingData.contactDetails?.email || '',
      phone: existingData.contactDetails?.phone || ''
    },
    documentVerification: {
      identityDocument: existingData.documentVerification?.identityDocument || '',
      proofOfAddress: existingData.documentVerification?.proofOfAddress || ''
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const handleContactChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      contactDetails: {
        ...formData.contactDetails,
        [field]: value
      }
    });
  };
  
  const handleDocumentChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      documentVerification: {
        ...formData.documentVerification,
        [field]: value
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personal Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input 
              id="dateOfBirth" 
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taxIdNumber">Tax ID Number</Label>
            <Input 
              id="taxIdNumber" 
              value={formData.taxIdNumber}
              onChange={(e) => setFormData({...formData, taxIdNumber: e.target.value})}
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input 
              id="nationality" 
              value={formData.nationality}
              onChange={(e) => setFormData({...formData, nationality: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="residenceCountry">Country of Residence</Label>
            <Input 
              id="residenceCountry" 
              value={formData.residenceCountry}
              onChange={(e) => setFormData({...formData, residenceCountry: e.target.value})}
              required
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Identification</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="idType">ID Type</Label>
            <select
              id="idType"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.idType}
              onChange={(e) => setFormData({...formData, idType: e.target.value})}
            >
              <option value="passport">Passport</option>
              <option value="drivingLicense">Driving License</option>
              <option value="nationalId">National ID Card</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="idNumber">ID Number</Label>
            <Input 
              id="idNumber" 
              value={formData.idNumber}
              onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="idExpiryDate">ID Expiry Date</Label>
            <Input 
              id="idExpiryDate" 
              type="date"
              value={formData.idExpiryDate}
              onChange={(e) => setFormData({...formData, idExpiryDate: e.target.value})}
              required
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email"
              value={formData.contactDetails.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              value={formData.contactDetails.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Documents</h3>
        <p className="text-sm text-muted-foreground">Please provide document references (in a real application, you would upload the actual files)</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="identityDocument">ID Document</Label>
            <Input 
              id="identityDocument" 
              placeholder="Document reference number"
              value={formData.documentVerification.identityDocument}
              onChange={(e) => handleDocumentChange('identityDocument', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="proofOfAddress">Proof of Address</Label>
            <Input 
              id="proofOfAddress" 
              placeholder="Document reference number"
              value={formData.documentVerification.proofOfAddress}
              onChange={(e) => handleDocumentChange('proofOfAddress', e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">Submit KYC Information</Button>
      </div>
    </form>
  );
};

// KYC Business Form component
const KYCBusinessForm = ({ onSubmit, existingData = {} }: any) => {
  const [formData, setFormData] = useState({
    companyName: existingData.companyName || '',
    companyRegistrationNumber: existingData.companyRegistrationNumber || '',
    companyType: existingData.companyType || 'limited',
    businessCategory: existingData.businessCategory || '',
    yearEstablished: existingData.yearEstablished || '',
    annualRevenue: existingData.annualRevenue || '',
    employeeCount: existingData.employeeCount || '',
    businessAddress: {
      street: existingData.businessAddress?.street || '',
      city: existingData.businessAddress?.city || '',
      state: existingData.businessAddress?.state || '',
      postalCode: existingData.businessAddress?.postalCode || '',
      country: existingData.businessAddress?.country || ''
    },
    contactDetails: {
      email: existingData.contactDetails?.email || '',
      phone: existingData.contactDetails?.phone || ''
    },
    documentVerification: {
      companyRegistration: existingData.documentVerification?.companyRegistration || '',
      taxCertificate: existingData.documentVerification?.taxCertificate || ''
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const handleAddressChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      businessAddress: {
        ...formData.businessAddress,
        [field]: value
      }
    });
  };
  
  const handleContactChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      contactDetails: {
        ...formData.contactDetails,
        [field]: value
      }
    });
  };
  
  const handleDocumentChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      documentVerification: {
        ...formData.documentVerification,
        [field]: value
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Company Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input 
              id="companyName" 
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyRegistrationNumber">Registration Number</Label>
            <Input 
              id="companyRegistrationNumber" 
              value={formData.companyRegistrationNumber}
              onChange={(e) => setFormData({...formData, companyRegistrationNumber: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyType">Company Type</Label>
            <select
              id="companyType"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.companyType}
              onChange={(e) => setFormData({...formData, companyType: e.target.value})}
            >
              <option value="limited">Limited Company</option>
              <option value="partnership">Partnership</option>
              <option value="llc">LLC</option>
              <option value="soleProprietor">Sole Proprietorship</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessCategory">Business Category</Label>
            <Input 
              id="businessCategory" 
              value={formData.businessCategory}
              onChange={(e) => setFormData({...formData, businessCategory: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="yearEstablished">Year Established</Label>
            <Input 
              id="yearEstablished" 
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              value={formData.yearEstablished}
              onChange={(e) => setFormData({...formData, yearEstablished: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annualRevenue">Annual Revenue (USD)</Label>
            <Input 
              id="annualRevenue" 
              type="number"
              min="0"
              step="1000"
              value={formData.annualRevenue}
              onChange={(e) => setFormData({...formData, annualRevenue: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employeeCount">Number of Employees</Label>
            <Input 
              id="employeeCount" 
              type="number"
              min="1"
              value={formData.employeeCount}
              onChange={(e) => setFormData({...formData, employeeCount: e.target.value})}
              required
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Business Address</h3>
        
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input 
            id="street" 
            value={formData.businessAddress.street}
            onChange={(e) => handleAddressChange('street', e.target.value)}
            required
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              value={formData.businessAddress.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input 
              id="state" 
              value={formData.businessAddress.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input 
              id="postalCode" 
              value={formData.businessAddress.postalCode}
              onChange={(e) => handleAddressChange('postalCode', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input 
              id="country" 
              value={formData.businessAddress.country}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email"
              value={formData.contactDetails.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              value={formData.contactDetails.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Documents</h3>
        <p className="text-sm text-muted-foreground">Please provide document references (in a real application, you would upload the actual files)</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyRegistration">Company Registration</Label>
            <Input 
              id="companyRegistration" 
              placeholder="Document reference number"
              value={formData.documentVerification.companyRegistration}
              onChange={(e) => handleDocumentChange('companyRegistration', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taxCertificate">Tax Certificate</Label>
            <Input 
              id="taxCertificate" 
              placeholder="Document reference number"
              value={formData.documentVerification.taxCertificate}
              onChange={(e) => handleDocumentChange('taxCertificate', e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">Submit KYC Information</Button>
      </div>
    </form>
  );
};

// KYC Status component (for when KYC has been submitted)
const KYCStatusView = ({ kycData, kycStatus, riskScore }: any) => {
  const isIndividual = !!kycData?.firstName;
  const isPending = kycStatus === KYCStatus.PENDING;
  const isRejected = kycStatus === KYCStatus.REJECTED;
  const isVerified = kycStatus === KYCStatus.VERIFIED;
  
  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isVerified && <ShieldCheck className="w-8 h-8 text-green-500 mr-3" />}
            {isPending && <Clock className="w-8 h-8 text-yellow-500 mr-3" />}
            {isRejected && <ShieldX className="w-8 h-8 text-red-500 mr-3" />}
            
            <div>
              <h3 className="font-medium text-lg">
                KYC {isVerified ? 'Verified' : isPending ? 'In Review' : 'Rejected'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isVerified && 'Your identity has been verified successfully.'}
                {isPending && 'Your information is currently being reviewed.'}
                {isRejected && 'Your KYC verification was not successful.'}
              </p>
            </div>
          </div>
          
          <KYCStatusBadge status={kycStatus} />
        </div>
      </div>
      
      {isVerified && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="flex">
            <UserCheck className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
            <div>
              <p className="text-green-800">
                Your identity has been verified and your account is fully activated.
                You now have access to all platform features.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {isPending && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex">
            <Info className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
            <div>
              <p className="text-yellow-800">
                Your KYC verification is currently in progress. This process typically takes 1-3 business days.
                We'll notify you once the verification is complete.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {isRejected && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
            <div>
              <p className="text-red-800 mb-2">
                Your KYC verification was unsuccessful. This may be due to:
              </p>
              <ul className="list-disc list-inside text-red-800 text-sm">
                <li>Unclear or invalid document images</li>
                <li>Information mismatch between documents and provided data</li>
                <li>Expired identification documents</li>
              </ul>
              <p className="text-red-800 mt-2">
                Please resubmit your KYC information with valid documents.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <Separator />
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">KYC Information</h3>
          <Badge variant="outline">
            {isIndividual ? 'Individual' : 'Business'}
          </Badge>
        </div>
        
        {isIndividual ? (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{kycData.firstName} {kycData.lastName}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{kycData.dateOfBirth}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nationality</p>
                <p className="font-medium">{kycData.nationality}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Country of Residence</p>
                <p className="font-medium">{kycData.residenceCountry}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID Type</p>
                <p className="font-medium capitalize">{kycData.idType}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">ID Number</p>
                <p className="font-medium">{kycData.idNumber}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{kycData.contactDetails?.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{kycData.contactDetails?.phone}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Company Name</p>
                <p className="font-medium">{kycData.companyName}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Registration Number</p>
                <p className="font-medium">{kycData.companyRegistrationNumber}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Company Type</p>
                <p className="font-medium capitalize">{kycData.companyType}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Business Category</p>
                <p className="font-medium">{kycData.businessCategory}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Year Established</p>
                <p className="font-medium">{kycData.yearEstablished}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Business Address</p>
              <p className="font-medium">
                {kycData.businessAddress?.street}, {kycData.businessAddress?.city}, 
                {kycData.businessAddress?.state} {kycData.businessAddress?.postalCode}, 
                {kycData.businessAddress?.country}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{kycData.contactDetails?.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{kycData.contactDetails?.phone}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {isVerified && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Risk Assessment</h3>
          <RiskScore score={riskScore} />
        </div>
      )}
      
      {isRejected && (
        <div className="flex justify-end mt-6">
          <Button>Resubmit KYC Information</Button>
        </div>
      )}
    </div>
  );
};

const KYCPage = () => {
  const { user, isLoggedIn } = useWeb3();
  const { kycUser, kycStatus, riskScore, kycData, submitKYCMutation } = useKYC();
  
  const [kycType, setKYCType] = useState<'individual' | 'business'>('individual');
  
  const handleSubmitKYC = (formData: any) => {
    submitKYCMutation.mutate(formData);
  };
  
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Identity Verification</h1>
          <p className="text-muted-foreground">Verify your identity to use all platform features</p>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              Please login to access identity verification.
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
  
  // If KYC has been submitted, show status view
  if (kycData) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Identity Verification</h1>
          <p className="text-muted-foreground">View your verification status</p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <KYCStatusView 
              kycData={kycData} 
              kycStatus={kycStatus} 
              riskScore={riskScore} 
            />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // KYC submission form
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Identity Verification</h1>
        <p className="text-muted-foreground">Complete your KYC verification to use all platform features</p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>KYC Verification</CardTitle>
              <CardDescription>
                Provide your information for verification
              </CardDescription>
            </div>
            <div className="flex items-center border rounded-md overflow-hidden">
              <Button 
                type="button" 
                variant={kycType === 'individual' ? 'default' : 'ghost'} 
                className="rounded-none"
                onClick={() => setKYCType('individual')}
              >
                <User className="w-4 h-4 mr-2" />
                Individual
              </Button>
              <Button 
                type="button" 
                variant={kycType === 'business' ? 'default' : 'ghost'} 
                className="rounded-none"
                onClick={() => setKYCType('business')}
              >
                <Building className="w-4 h-4 mr-2" />
                Business
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="my-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Identity Verification Required</AlertTitle>
              <AlertDescription>
                To comply with regulations and enhance security, we require all users to complete identity verification.
                This process is necessary for accessing all platform features.
              </AlertDescription>
            </Alert>
          </div>
          
          {kycType === 'individual' ? (
            <KYCIndividualForm onSubmit={handleSubmitKYC} />
          ) : (
            <KYCBusinessForm onSubmit={handleSubmitKYC} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCPage;