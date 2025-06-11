'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { useWallet } from '@/contexts/wallet-context';
import { Wallet, Heart, Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CreateCauseForm } from '@/components/create-cause-form';

export function Header() {
  const { account, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DonationPlatform
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {isConnected && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Cause
                </Button>
              </DialogTrigger>
              <CreateCauseForm />
            </Dialog>
          )}
          
          <ModeToggle />
          
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">
                {formatAddress(account!)}
              </div>
              <Button variant="outline" size="sm" onClick={disconnectWallet}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button 
              onClick={connectWallet} 
              disabled={isConnecting}
              size="sm"
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}