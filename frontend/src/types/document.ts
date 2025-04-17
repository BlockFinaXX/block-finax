export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  hash: string;
  url: string;
  contractId?: string;
  uploadedBy: string;
  uploadedAt: Date;
  tags: string[];
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getDocumentIcon = (type: string): string => {
  if (type.includes('pdf')) return 'file-pdf';
  if (type.includes('word') || type.includes('msword')) return 'file-word';
  if (type.includes('excel') || type.includes('spreadsheet')) return 'file-excel';
  if (type.includes('image')) return 'image';
  if (type.includes('zip') || type.includes('compressed')) return 'file-archive';
  if (type.includes('text')) return 'file-text';
  return 'file';
};
