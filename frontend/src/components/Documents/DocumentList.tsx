import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  File,
  FileText,
  FilePlus,
  Calendar,
  User,
  Link2,
  Search,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { Link } from 'wouter';
import { useDocuments } from '@/hooks/useDocuments';
import { Document, formatFileSize, getDocumentIcon } from '@/types/document';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DocumentList = () => {
  const { documents, isLoading, deleteDocument, isDeleting } = useDocuments();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Ensure documents is treated as Document[] even if it comes as unknown
  const documentsList: Document[] = Array.isArray(documents) ? documents : [];
  
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDeleteClick = (documentId: string) => {
    setDocumentToDelete(documentId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      await deleteDocument(parseInt(documentToDelete));
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
      toast({
        title: "Document Deleted",
        description: "The document has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting the document",
        variant: "destructive"
      });
    }
  };
  
  const filteredDocuments = documentsList.filter((doc: Document) => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.tags && doc.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">Documents</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search documents..."
              className="pl-9"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <Link href="/documents/upload">
            <Button>
              <FilePlus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </Link>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <h2 className="text-lg font-medium">Your Documents</h2>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-gray-500">
              Loading documents...
            </div>
          ) : documentsList.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-2">No documents found</p>
              <Link href="/documents/upload">
                <Button>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Upload Your First Document
                </Button>
              </Link>
            </div>
          ) : filteredDocuments?.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p>No documents match your search</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments?.map((document: Document) => (
                <div key={document.id} className="flex items-start p-4 border border-gray-200 rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-md mr-4">
                    <File className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{document.name}</h3>
                        <div className="flex flex-wrap gap-y-1 items-center text-sm text-gray-500 mt-1">
                          <span className="flex items-center mr-3">
                            <FileText className="h-4 w-4 mr-1 text-gray-400" />
                            {formatFileSize(document.size)}
                          </span>
                          <span className="flex items-center mr-3">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {formatDate(document.uploadedAt)}
                          </span>
                          {document.contractId && (
                            <span className="flex items-center">
                              <Link2 className="h-4 w-4 mr-1 text-gray-400" />
                              <Link href={`/contracts/${document.contractId}`}>
                                <span className="text-primary hover:text-primary-700 cursor-pointer">
                                  View Contract
                                </span>
                              </Link>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center mt-2 sm:mt-0 space-x-2">
                        <a 
                          href={document.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary-700"
                        >
                          View
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(document.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentList;
