import React, { useState } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useInvoice } from '@/hooks/useInvoice';
import { useWallet } from '@/hooks/useWallet';
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
import { FileText, Plus, AlertCircle, Calendar, DollarSign, ArrowRight, CreditCard, Download, Eye, Send } from 'lucide-react';
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

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const InvoiceCard = ({ invoice, onView, onPay }: any) => {
  const isPaid = invoice.status === 'PAID';
  const isOverdue = invoice.status === 'OVERDUE';
  const dueDate = new Date(invoice.dueDate);
  const issuedDate = new Date(invoice.issueDate);
  const now = new Date();
  
  // Check if invoice is overdue but status hasn't been updated yet
  const shouldBeOverdue = !isPaid && dueDate < now && invoice.status !== 'OVERDUE';
  
  const getStatusBadge = () => {
    if (isPaid) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
    if (isOverdue || shouldBeOverdue) return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Unpaid</Badge>;
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Invoice #{invoice.invoiceNumber}</CardTitle>
            {getStatusBadge()}
          </div>
          <div className="text-sm text-muted-foreground">
            {format(issuedDate, 'MMM d, yyyy')}
          </div>
        </div>
        <CardDescription>
          {invoice.items?.length || 0} items
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-xl font-bold">{formatCurrency(invoice.amount, invoice.currency)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Due Date</p>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <p className={`text-sm ${shouldBeOverdue ? 'text-red-600 font-medium' : ''}`}>
                {format(dueDate, 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onView(invoice.id)}>
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        {!isPaid && (
          <Button size="sm" onClick={() => onPay(invoice.id)}>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const InvoiceDetail = ({ invoice, onClose, onPay }: any) => {
  if (!invoice) return null;
  
  const isPaid = invoice.status === 'PAID';
  const isOverdue = invoice.status === 'OVERDUE';
  const dueDate = new Date(invoice.dueDate);
  const issuedDate = new Date(invoice.issueDate);
  
  const getStatusBadge = () => {
    if (isPaid) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
    if (isOverdue) return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Unpaid</Badge>;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber}</h2>
          <div className="flex items-center mt-1 space-x-2">
            <p className="text-muted-foreground">Status:</p>
            {getStatusBadge()}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Issue Date</p>
          <p>{format(issuedDate, 'MMMM d, yyyy')}</p>
          <p className="text-sm text-muted-foreground mt-2">Due Date</p>
          <p>{format(dueDate, 'MMMM d, yyyy')}</p>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="font-medium mb-1">From</p>
          <p>Seller ID: {invoice.sellerId}</p>
        </div>
        <div>
          <p className="font-medium mb-1">To</p>
          <p>Buyer ID: {invoice.buyerId}</p>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-3">Items</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.map((item: InvoiceItem, index: number) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.unitPrice, invoice.currency)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.totalPrice, invoice.currency)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center p-4 bg-muted rounded-md">
        <p className="font-medium">Total Amount</p>
        <p className="text-xl font-bold">{formatCurrency(invoice.amount, invoice.currency)}</p>
      </div>
      
      {invoice.paymentTerms && (
        <div>
          <h3 className="font-medium mb-2">Payment Terms</h3>
          <p className="text-sm">{invoice.paymentTerms}</p>
        </div>
      )}
      
      {invoice.notes && (
        <div>
          <h3 className="font-medium mb-2">Notes</h3>
          <p className="text-sm">{invoice.notes}</p>
        </div>
      )}
      
      <div className="flex justify-end space-x-3 mt-6">
        {!isPaid && (
          <Button onClick={() => onPay(invoice.id)}>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay Invoice
          </Button>
        )}
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

const PayInvoiceDialog = ({ isOpen, onClose, invoice, wallets, onPayInvoice }: any) => {
  const [walletId, setWalletId] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletId) return;
    
    onPayInvoice({
      id: invoice?.id,
      fromWalletId: parseInt(walletId)
    });
    
    setWalletId('');
    onClose();
  };
  
  if (!invoice) return null;
  
  // Filter to only show wallets with sufficient balance
  const eligibleWallets = wallets.filter(
    (w: any) => 
      w.walletType === 'MAIN' && 
      w.currency === invoice.currency && 
      parseFloat(w.balance) >= parseFloat(invoice.amount)
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay Invoice #{invoice.invoiceNumber}</DialogTitle>
          <DialogDescription>
            Select a wallet to pay this invoice.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex justify-between py-2 px-3 bg-muted rounded-md">
              <span>Invoice Amount:</span>
              <span className="font-medium">{formatCurrency(invoice.amount, invoice.currency)}</span>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="walletSelect">Select Wallet</Label>
              <select
                id="walletSelect"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                required
              >
                <option value="">Select a wallet</option>
                {eligibleWallets.length > 0 ? (
                  eligibleWallets.map((wallet: any) => (
                    <option key={wallet.id} value={wallet.id}>
                      Main Wallet ({formatCurrency(wallet.balance, wallet.currency)} available)
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No wallets with sufficient balance</option>
                )}
              </select>
              
              {eligibleWallets.length === 0 && (
                <p className="text-sm text-red-500 mt-2">
                  You don't have any wallets with sufficient balance. Please deposit funds first.
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={eligibleWallets.length === 0 || !walletId}>
              Pay Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CreateInvoiceForm = ({ onSubmit, onCancel, sellerWalletAddress }: any) => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${Date.now().toString().substring(7)}`,
    buyerId: '',
    amount: '',
    currency: 'USD',
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 30 days from now
    items: [{ description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
    paymentTerms: 'Net 30',
    notes: '',
  });
  
  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        { description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
      ]
    });
  };
  
  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...invoiceData.items];
    
    // Convert string numbers to numbers
    if (field === 'quantity' || field === 'unitPrice') {
      value = parseFloat(value as string) || 0;
    }
    
    // @ts-ignore
    newItems[index][field] = value;
    
    // Recalculate total price
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    // Recalculate overall invoice amount
    const totalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    setInvoiceData({
      ...invoiceData,
      items: newItems,
      amount: totalAmount.toString()
    });
  };
  
  const removeItem = (index: number) => {
    const newItems = [...invoiceData.items];
    newItems.splice(index, 1);
    
    // Recalculate overall invoice amount
    const totalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    setInvoiceData({
      ...invoiceData,
      items: newItems.length ? newItems : [{ description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
      amount: totalAmount.toString()
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...invoiceData,
      sellerId: 1, // This should be the current user's ID in a real app
      buyerId: parseInt(invoiceData.buyerId),
      dueDate: new Date(invoiceData.dueDate)
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input 
            id="invoiceNumber" 
            value={invoiceData.invoiceNumber}
            onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input 
            id="dueDate" 
            type="date"
            value={invoiceData.dueDate}
            onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="buyerId">Buyer ID</Label>
        <Input 
          id="buyerId" 
          type="number"
          placeholder="Enter the buyer's ID"
          value={invoiceData.buyerId}
          onChange={(e) => setInvoiceData({...invoiceData, buyerId: e.target.value})}
          required
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Invoice Items</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
        
        <div className="space-y-4">
          {invoiceData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end border p-3 rounded-md">
              <div className="col-span-5 space-y-1">
                <Label htmlFor={`item-${index}-desc`}>Description</Label>
                <Input 
                  id={`item-${index}-desc`} 
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  required
                />
              </div>
              
              <div className="col-span-2 space-y-1">
                <Label htmlFor={`item-${index}-qty`}>Quantity</Label>
                <Input 
                  id={`item-${index}-qty`} 
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  required
                />
              </div>
              
              <div className="col-span-2 space-y-1">
                <Label htmlFor={`item-${index}-price`}>Unit Price</Label>
                <Input 
                  id={`item-${index}-price`} 
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                  required
                />
              </div>
              
              <div className="col-span-2 space-y-1">
                <Label>Total</Label>
                <div className="h-10 flex items-center px-3 rounded-md bg-muted">
                  {formatCurrency(item.totalPrice, invoiceData.currency)}
                </div>
              </div>
              
              <div className="col-span-1">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  className="px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeItem(index)}
                  disabled={invoiceData.items.length <= 1}
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end p-4 bg-muted rounded-md">
        <div className="flex items-center gap-4">
          <span className="font-medium">Total Amount:</span>
          <span className="text-xl font-bold">{formatCurrency(parseFloat(invoiceData.amount) || 0, invoiceData.currency)}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="paymentTerms">Payment Terms</Label>
        <Input 
          id="paymentTerms" 
          value={invoiceData.paymentTerms}
          onChange={(e) => setInvoiceData({...invoiceData, paymentTerms: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          rows={3}
          placeholder="Additional information for the invoice..."
          value={invoiceData.notes}
          onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Invoice
        </Button>
      </div>
    </form>
  );
};

const NoInvoicesAlert = ({ type }: { type: string }) => (
  <Alert className="mb-6">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>No {type} invoices</AlertTitle>
    <AlertDescription>
      You don't have any {type.toLowerCase()} invoices at the moment.
    </AlertDescription>
  </Alert>
);

const InvoicePage = () => {
  const { user, isLoggedIn } = useWeb3();
  const { 
    sellerInvoices, buyerInvoices, invoice, 
    isLoadingSellerInvoices, isLoadingBuyerInvoices, isLoadingInvoice,
    createInvoiceMutation, payInvoiceMutation
  } = useInvoice();
  const { wallets } = useWallet();
  
  const [createMode, setCreateMode] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  
  const handleViewInvoice = (invoiceId: number) => {
    setSelectedInvoiceId(invoiceId);
  };
  
  const handleCloseInvoice = () => {
    setSelectedInvoiceId(null);
  };
  
  const handlePayInvoice = (invoiceId: number) => {
    setSelectedInvoiceId(invoiceId);
    setPayDialogOpen(true);
  };
  
  const submitPayInvoice = (paymentData: any) => {
    payInvoiceMutation.mutate({
      id: paymentData.id,
      fromWalletId: paymentData.fromWalletId
    });
  };
  
  const handleCreateInvoice = (invoiceData: any) => {
    createInvoiceMutation.mutate(invoiceData);
    setCreateMode(false);
  };
  
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage your invoices</p>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              Please login to view your invoices.
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
  
  // Display invoice detail view if an invoice is selected
  if (selectedInvoiceId && invoice && !createMode) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Invoice Details</h1>
            <p className="text-muted-foreground">View and manage your invoice</p>
          </div>
          <Button variant="ghost" onClick={handleCloseInvoice}>
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Invoices
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <InvoiceDetail 
              invoice={invoice} 
              onClose={handleCloseInvoice} 
              onPay={handlePayInvoice} 
            />
          </CardContent>
        </Card>
        
        <PayInvoiceDialog 
          isOpen={payDialogOpen}
          onClose={() => setPayDialogOpen(false)}
          invoice={invoice}
          wallets={wallets}
          onPayInvoice={submitPayInvoice}
        />
      </div>
    );
  }
  
  // Display create invoice form
  if (createMode) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Invoice</h1>
            <p className="text-muted-foreground">Create a new invoice for your buyer</p>
          </div>
          <Button variant="ghost" onClick={() => setCreateMode(false)}>
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Invoices
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <CreateInvoiceForm 
              onSubmit={handleCreateInvoice}
              onCancel={() => setCreateMode(false)}
              sellerWalletAddress={user?.walletAddress}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Main invoice list view
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage your invoices</p>
        </div>
        <Button onClick={() => setCreateMode(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>
      
      <Tabs defaultValue="received">
        <TabsList>
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="received" className="space-y-4 mt-4">
          {isLoadingBuyerInvoices ? (
            <p>Loading received invoices...</p>
          ) : (
            <>
              {(!buyerInvoices || buyerInvoices.length === 0) ? (
                <NoInvoicesAlert type="Received" />
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {buyerInvoices.map((invoice: any) => (
                    <InvoiceCard 
                      key={invoice.id} 
                      invoice={invoice} 
                      onView={handleViewInvoice}
                      onPay={handlePayInvoice}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="sent" className="space-y-4 mt-4">
          {isLoadingSellerInvoices ? (
            <p>Loading sent invoices...</p>
          ) : (
            <>
              {(!sellerInvoices || sellerInvoices.length === 0) ? (
                <NoInvoicesAlert type="Sent" />
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {sellerInvoices.map((invoice: any) => (
                    <InvoiceCard 
                      key={invoice.id} 
                      invoice={invoice} 
                      onView={handleViewInvoice}
                      onPay={() => {}} // Sellers don't pay their own invoices
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoicePage;