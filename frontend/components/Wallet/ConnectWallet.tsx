import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import { shortenAddress } from '@/types/user';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ConnectWallet = () => {
  const { account, balance, isConnected, isConnecting, connectWallet, disconnectWallet } = useWeb3();
  
  return (
    <div className="relative inline-block">
      {isConnected ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline"
              className="flex items-center border border-slate-200 bg-white hover:bg-slate-50"
            >
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <Wallet className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-medium text-slate-800">{shortenAddress(account || '')}</span>
                <ChevronDown className="ml-2 h-4 w-4 text-slate-500" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2">
            <div className="px-2 py-1.5 text-sm text-slate-500 border-b border-slate-100 mb-1">
              <div className="flex justify-between items-center">
                <span>Balance</span>
                <span className="font-medium text-slate-900">{parseFloat(balance).toFixed(4)} ETH</span>
              </div>
            </div>
            <DropdownMenuItem 
              onClick={disconnectWallet}
              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
            >
              Disconnect Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          onClick={connectWallet}
          disabled={isConnecting}
          variant="default"
          className="flex items-center bg-primary hover:bg-primary/90 shadow-sm"
        >
          <div className="h-4 w-4 mr-2 flex items-center justify-center">
            {isConnecting ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Wallet className="h-4 w-4" />
            )}
          </div>
          <span>{isConnecting ? 'Connecting...' : 'Connect Digital Wallet'}</span>
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
