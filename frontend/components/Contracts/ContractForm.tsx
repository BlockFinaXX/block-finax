import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWeb3 } from '@/hooks/useWeb3';
import { useContracts } from '@/hooks/useContracts';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { PartyRole, TradeTerms, Party } from '@/types/contract';

const ContractForm = () => {
  const { account } = useWeb3();
  const { createContract, isCreatingContract } = useContracts();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    incoterm: 'FOB',
    paymentTerms: 'Letter of Credit',
    currency: 'ETH',
    amount: '',
    deliveryDeadline: '',
    inspectionPeriod: '7',
    disputeResolutionMechanism: 'Mediator',
    exporterName: '',
    exporterCountry: '',
    mediatorAddress: '',
    mediatorName: '',
    mediatorCountry: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a contract",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create parties array
      const parties: Party[] = [
        {
          address: account,
          role: PartyRole.IMPORTER,
          name: 'You (Importer)',
          country: 'Your Country'
        }
      ];
      
      if (formData.exporterName) {
        parties.push({
          address: '0x0000000000000000000000000000000000000000', // To be filled by exporter
          role: PartyRole.EXPORTER,
          name: formData.exporterName,
          country: formData.exporterCountry
        });
      }
      
      if (formData.mediatorAddress) {
        parties.push({
          address: formData.mediatorAddress,
          role: PartyRole.MEDIATOR,
          name: formData.mediatorName || 'Mediator',
          country: formData.mediatorCountry || 'International'
        });
      }
      
      // Create trade terms
      const tradeTerms: TradeTerms = {
        incoterm: formData.incoterm,
        paymentTerms: formData.paymentTerms,
        currency: formData.currency,
        amount: parseFloat(formData.amount) || 0,
        deliveryDeadline: new Date(formData.deliveryDeadline),
        inspectionPeriod: parseInt(formData.inspectionPeriod) || 7,
        disputeResolutionMechanism: formData.disputeResolutionMechanism
      };
      
      // Create contract milestones
      const milestones = {
        created: new Date()
      };
      
      await createContract({
        title: formData.title,
        description: formData.description,
        status: 'DRAFT',
        parties,
        tradeTerms,
        milestones,
        createdBy: account,
        documents: []
      });
      
      toast({
        title: "Contract Created",
        description: "Your contract draft has been created successfully",
      });
      
      navigate('/contracts');
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: "Error Creating Contract",
        description: "There was an error creating your contract",
        variant: "destructive"
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Contract Details</h3>
          <p className="text-sm text-gray-500">Enter the basic information for your trade contract</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Contract Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Coffee Export to Europe"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the goods or services being traded"
                rows={3}
              />
            </div>
          </div>
          
          <div className="pt-4">
            <h4 className="text-md font-medium mb-2">Trade Terms</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incoterm">Incoterm</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('incoterm', value)}
                  defaultValue={formData.incoterm}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Incoterm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXW">EXW (Ex Works)</SelectItem>
                    <SelectItem value="FOB">FOB (Free on Board)</SelectItem>
                    <SelectItem value="CIF">CIF (Cost, Insurance, Freight)</SelectItem>
                    <SelectItem value="DDP">DDP (Delivered Duty Paid)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('paymentTerms', value)}
                  defaultValue={formData.paymentTerms}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Payment Terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Letter of Credit">Letter of Credit</SelectItem>
                    <SelectItem value="Open Account">Open Account</SelectItem>
                    <SelectItem value="Advance Payment">Advance Payment</SelectItem>
                    <SelectItem value="Documentary Collection">Documentary Collection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('currency', value)}
                  defaultValue={formData.currency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETH">ETH (Ethereum)</SelectItem>
                    <SelectItem value="USDT">USDT (Tether)</SelectItem>
                    <SelectItem value="USDC">USDC (USD Coin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g. 5.2"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deliveryDeadline">Delivery Deadline</Label>
                <Input
                  id="deliveryDeadline"
                  name="deliveryDeadline"
                  type="date"
                  value={formData.deliveryDeadline}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inspectionPeriod">Inspection Period (days)</Label>
                <Input
                  id="inspectionPeriod"
                  name="inspectionPeriod"
                  type="number"
                  value={formData.inspectionPeriod}
                  onChange={handleChange}
                  placeholder="e.g. 7"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <h4 className="text-md font-medium mb-2">Parties</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exporterName">Exporter Name</Label>
                <Input
                  id="exporterName"
                  name="exporterName"
                  value={formData.exporterName}
                  onChange={handleChange}
                  placeholder="Name of the exporter"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exporterCountry">Exporter Country</Label>
                <Input
                  id="exporterCountry"
                  name="exporterCountry"
                  value={formData.exporterCountry}
                  onChange={handleChange}
                  placeholder="Country of the exporter"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mediatorAddress">Mediator Address (optional)</Label>
                <Input
                  id="mediatorAddress"
                  name="mediatorAddress"
                  value={formData.mediatorAddress}
                  onChange={handleChange}
                  placeholder="Ethereum address of the mediator"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mediatorName">Mediator Name (optional)</Label>
                <Input
                  id="mediatorName"
                  name="mediatorName"
                  value={formData.mediatorName}
                  onChange={handleChange}
                  placeholder="Name of the mediator"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mediatorCountry">Mediator Country (optional)</Label>
                <Input
                  id="mediatorCountry"
                  name="mediatorCountry"
                  value={formData.mediatorCountry}
                  onChange={handleChange}
                  placeholder="Country of the mediator"
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate('/contracts')}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isCreatingContract}
          >
            {isCreatingContract ? 'Creating...' : 'Create Contract'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ContractForm;
