import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useWeb3 } from '@/hooks/useWeb3';
import { Wallet } from 'lucide-react';

const WalletBalance = () => {
  const { account, balance, isConnected } = useWeb3();
  
  if (!isConnected) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-medium">Wallet Balance</h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="mr-4 p-2 bg-primary rounded-full">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="text-2xl font-bold">{Number(balance).toFixed(4)} ETH</p>
            <p className="text-xs text-gray-500 font-mono mt-1">{account}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletBalance;
