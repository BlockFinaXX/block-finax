import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Users, 
  File, 
  ArrowLeft, 
  Upload, 
  Globe, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useContracts } from '@/hooks/useContracts';
import { useDocuments } from '@/hooks/useDocuments';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';
import { EscrowContract, ContractStatus, getStatusColor, getStatusText, PartyRole } from '@/types/contract';
import { formatFileSize, getDocumentIcon } from '@/types/document';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContractDetailsProps {
  contractId: string;
}

const ContractDetails: React.FC<ContractDetailsProps> = ({ contractId }) => {
  const [, navigate] = useLocation();
  const { contract, isLoadingContract, updateContract, isUpdatingContract } = useContracts(parseInt(contractId));
  const { documents, isLoading: isLoadingDocuments, uploadDocument } = useDocuments(parseInt(contractId));
  const { account, signer } = useWeb3();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [documentType, setDocumentType] = useState('');
  const [documentTags, setDocumentTags] = useState('');

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'N/A';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile || !account) return;
    
    try {
      await uploadDocument({
        file: selectedFile,
        contractId: parseInt(contractId),
        tags: documentTags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });
      
      setSelectedFile(null);
      setDocumentType('');
      setDocumentTags('');
      setUploadDialogOpen(false);
      
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully."
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateContractStatus = async (newStatus: ContractStatus) => {
    if (!contract) return;
    
    try {
      await updateContract({
        id: parseInt(contractId),
        data: { 
          status: newStatus,
          milestones: {
            ...contract.milestones,
            [newStatus.toLowerCase()]: new Date()
          }
        }
      });
      
      toast({
        title: "Status Updated",
        description: `Contract status changed to ${getStatusText(newStatus)}`
      });
    } catch (error) {
      console.error('Error updating contract status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update contract status. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Helper function to check if user can perform a specific action based on contract status and role
  const canPerformAction = (action: string): boolean => {
    if (!contract || !account) return false;
    
    const userParty = contract.parties.find(party => party.address === account);
    if (!userParty) return false;
    
    switch (action) {
      case 'fund':
        return contract.status === ContractStatus.AWAITING_FUNDS && 
               userParty.role === PartyRole.IMPORTER;
      case 'confirmShipment':
        return contract.status === ContractStatus.FUNDED && 
               userParty.role === PartyRole.EXPORTER;
      case 'confirmReceipt':
        return contract.status === ContractStatus.GOODS_SHIPPED && 
               userParty.role === PartyRole.IMPORTER;
      case 'raiseDispute':
        return [ContractStatus.FUNDED, ContractStatus.GOODS_SHIPPED].includes(contract.status) && 
               (userParty.role === PartyRole.IMPORTER || userParty.role === PartyRole.EXPORTER);
      case 'resolveDispute':
        return contract.status === ContractStatus.DISPUTED && 
               userParty.role === PartyRole.MEDIATOR;
      default:
        return false;
    }
  };

  if (isLoadingContract) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-gray-500">Loading contract details...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Contract Not Found</h2>
          <p className="text-gray-500 mb-4">The contract you're looking for doesn't exist or you don't have access to it.</p>
          <Link href="/contracts">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contracts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/contracts">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contracts
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row justify-between md:items-center mt-2">
          <h1 className="text-2xl font-semibold text-gray-900">{contract.title}</h1>
          <Badge 
            variant="outline" 
            className={`bg-${getStatusColor(contract.status)}-100 text-${getStatusColor(contract.status)}-800 border-${getStatusColor(contract.status)}-200 mt-2 md:mt-0`}
          >
            {getStatusText(contract.status)}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="parties">Parties</TabsTrigger>
          <TabsTrigger value="terms">Trade Terms</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <h3 className="text-lg font-medium">Contract Details</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                    <p className="mt-1">{contract.description || 'No description provided'}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-1.5" />
                      <span className="text-sm text-gray-500 mr-1">Created:</span>
                      <span className="text-sm font-medium">{formatDate(contract.createdAt)}</span>
                    </div>
                    {contract.tradeTerms?.deliveryDeadline && (
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-1.5" />
                        <span className="text-sm text-gray-500 mr-1">Delivery by:</span>
                        <span className="text-sm font-medium">{formatDate(contract.tradeTerms.deliveryDeadline)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-1.5" />
                      <span className="text-sm text-gray-500 mr-1">Parties:</span>
                      <span className="text-sm font-medium">{contract.parties.length}</span>
                    </div>
                    <div className="flex items-center">
                      <File className="h-5 w-5 text-gray-400 mr-1.5" />
                      <span className="text-sm text-gray-500 mr-1">Documents:</span>
                      <span className="text-sm font-medium">{documents?.length || 0}</span>
                    </div>
                  </div>
                  
                  {contract.contractAddress && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-500">Contract Address</h4>
                      <div className="flex items-center mt-1">
                        <a 
                          href={`https://etherscan.io/address/${contract.contractAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-600 underline font-mono text-sm"
                        >
                          {contract.contractAddress}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Contract Timeline</h4>
                    <div className="space-y-2">
                      {Object.entries(contract.milestones || {}).map(([key, date]) => (
                        date && (
                          <div key={key} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm capitalize">{key}:</span>
                            <span className="text-sm ml-1">{formatDate(date)}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Contract Actions</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contract.status === ContractStatus.DRAFT && (
                    <Button 
                      className="w-full" 
                      onClick={() => updateContractStatus(ContractStatus.AWAITING_FUNDS)}
                    >
                      Publish Contract
                    </Button>
                  )}
                  
                  {canPerformAction('fund') && (
                    <Button 
                      className="w-full"
                      onClick={() => updateContractStatus(ContractStatus.FUNDED)}
                    >
                      Fund Escrow
                    </Button>
                  )}
                  
                  {canPerformAction('confirmShipment') && (
                    <Button 
                      className="w-full"
                      onClick={() => updateContractStatus(ContractStatus.GOODS_SHIPPED)}
                    >
                      Confirm Shipment
                    </Button>
                  )}
                  
                  {canPerformAction('confirmReceipt') && (
                    <Button 
                      className="w-full"
                      onClick={() => updateContractStatus(ContractStatus.GOODS_RECEIVED)}
                    >
                      Confirm Receipt
                    </Button>
                  )}
                  
                  {contract.status === ContractStatus.GOODS_RECEIVED && (
                    <Button 
                      className="w-full"
                      onClick={() => updateContractStatus(ContractStatus.COMPLETED)}
                    >
                      Complete Contract
                    </Button>
                  )}
                  
                  {canPerformAction('raiseDispute') && (
                    <Button 
                      variant="destructive"
                      className="w-full"
                      onClick={() => updateContractStatus(ContractStatus.DISPUTED)}
                    >
                      Raise Dispute
                    </Button>
                  )}
                  
                  {canPerformAction('resolveDispute') && (
                    <Button 
                      className="w-full"
                      onClick={() => updateContractStatus(ContractStatus.COMPLETED)}
                    >
                      Resolve Dispute
                    </Button>
                  )}
                  
                  <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Document</DialogTitle>
                        <DialogDescription>
                          Add a document to this contract. Documents are cryptographically verified.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="document-type">Document Type</Label>
                          <Input
                            id="document-type"
                            placeholder="e.g. Invoice, Bill of Lading"
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="document-tags">Tags (comma separated)</Label>
                          <Input
                            id="document-tags"
                            placeholder="e.g. invoice, payment"
                            value={documentTags}
                            onChange={(e) => setDocumentTags(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="file-upload">File</Label>
                          <Input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleUploadDocument}
                          disabled={!selectedFile}
                        >
                          Upload
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  {[ContractStatus.DRAFT, ContractStatus.AWAITING_FUNDS].includes(contract.status) && (
                    <Button 
                      variant="outline" 
                      className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => updateContractStatus(ContractStatus.CANCELLED)}
                    >
                      Cancel Contract
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-medium">Contract Documents</h3>
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>
                      Add a document to this contract. Documents are cryptographically verified.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="document-type">Document Type</Label>
                      <Input
                        id="document-type"
                        placeholder="e.g. Invoice, Bill of Lading"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="document-tags">Tags (comma separated)</Label>
                      <Input
                        id="document-tags"
                        placeholder="e.g. invoice, payment"
                        value={documentTags}
                        onChange={(e) => setDocumentTags(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="file-upload">File</Label>
                      <Input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUploadDocument}
                      disabled={!selectedFile}
                    >
                      Upload
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoadingDocuments ? (
                <div className="py-12 text-center text-gray-500">
                  Loading documents...
                </div>
              ) : documents?.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <File className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="mb-2">No documents attached to this contract yet</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setUploadDialogOpen(true)}
                  >
                    Upload First Document
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents?.map((document) => (
                    <div key={document.id} className="flex items-start p-4 border border-gray-200 rounded-lg">
                      <div className="p-2 bg-gray-100 rounded-md mr-4">
                        <File className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h4 className="font-medium">{document.name}</h4>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <span className="mr-3">{formatFileSize(document.size)}</span>
                              <span>Uploaded {formatDate(document.uploadedAt)}</span>
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <a 
                              href={document.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary-600 text-sm"
                            >
                              View Document
                            </a>
                          </div>
                        </div>
                        {document.tags && document.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {document.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parties">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Contract Parties</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {contract.parties.map((party, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <Badge className="mr-2">
                            {party.role}
                          </Badge>
                          <h4 className="font-medium">{party.name}</h4>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Globe className="h-4 w-4 mr-1" />
                          <span>{party.country}</span>
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <p className="text-sm font-mono text-gray-500">{party.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Trade Terms</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Payment Information</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Amount</label>
                      <div className="flex items-center mt-1">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-medium">{contract.tradeTerms.amount} {contract.tradeTerms.currency}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-500">Payment Terms</label>
                      <div className="mt-1 font-medium">{contract.tradeTerms.paymentTerms}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Shipping Information</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Incoterm</label>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-medium">{contract.tradeTerms.incoterm}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-500">Delivery Deadline</label>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-medium">{formatDate(contract.tradeTerms.deliveryDeadline)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-500">Inspection Period</label>
                      <div className="mt-1 font-medium">{contract.tradeTerms.inspectionPeriod} days</div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Dispute Resolution</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p>{contract.tradeTerms.disputeResolutionMechanism}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractDetails;
