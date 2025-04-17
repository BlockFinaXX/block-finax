import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContracts } from '@/hooks/useContracts';
import { useDocuments } from '@/hooks/useDocuments';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/hooks/useWeb3';
import { useLocation } from 'wouter';
import { Upload, FileCheck, ArrowLeft } from 'lucide-react';

const DocumentUpload = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { contracts, isLoadingContracts } = useContracts();
  const { uploadDocument, isUploading } = useDocuments();
  const { account } = useWeb3();
  
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [tags, setTags] = useState('');
  const [contractId, setContractId] = useState<string>('');
  const [isUploaded, setIsUploaded] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!file || !account) {
      toast({
        title: "Upload Error",
        description: "Please select a file and connect your wallet",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const parsedContractId = contractId ? parseInt(contractId) : undefined;
      const tagsList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await uploadDocument({
        file,
        contractId: parsedContractId,
        tags: tagsList
      });
      
      setIsUploaded(true);
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document",
        variant: "destructive"
      });
    }
  };
  
  const handleReset = () => {
    setFile(null);
    setDocumentType('');
    setTags('');
    setContractId('');
    setIsUploaded(false);
  };
  
  if (isUploaded) {
    return (
      <div>
        <Button 
          variant="ghost" 
          className="pl-0 mb-6"
          onClick={() => navigate('/documents')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
        
        <Card className="max-w-xl mx-auto">
          <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FileCheck className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-medium mb-2">Document Uploaded Successfully!</h2>
            <p className="text-gray-500 text-center mb-6">
              Your document has been uploaded and is being processed. 
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={handleReset}
              >
                Upload Another
              </Button>
              <Button onClick={() => navigate('/documents')}>
                View All Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div>
      <Button 
        variant="ghost" 
        className="pl-0 mb-6"
        onClick={() => navigate('/documents')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Documents
      </Button>
      
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Upload Document</h1>
      
      <Card className="max-w-xl">
        <CardHeader>
          <h3 className="text-lg font-medium">Document Information</h3>
          <p className="text-sm text-gray-500">Upload a document to be verified and stored on the blockchain</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">File</Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-sm text-gray-500">
                Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Input
              id="document-type"
              placeholder="e.g. Invoice, Bill of Lading, Certificate of Origin"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              placeholder="e.g. shipping, payment, customs"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <p className="text-xs text-gray-500">Add tags to help organize and search for your documents</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contract">Assign to Contract (optional)</Label>
            <Select onValueChange={setContractId} value={contractId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a contract" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {isLoadingContracts ? (
                  <SelectItem value="" disabled>Loading contracts...</SelectItem>
                ) : (
                  contracts.map((contract) => (
                    <SelectItem key={contract.id} value={contract.id.toString()}>
                      {contract.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate('/documents')}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>Uploading...</>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DocumentUpload;
