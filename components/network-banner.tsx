'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';

export function NetworkBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  useEffect(() => {
    const checkNetwork = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          const isScrollSepolia = parseInt(chainId, 16) === 534351;
          setIsWrongNetwork(!isScrollSepolia);
          setShowBanner(!isScrollSepolia);
        } catch (error) {
          console.error('Error checking network:', error);
        }
      }
    };

    checkNetwork();

    if (typeof window.ethereum !== 'undefined') {
      const handleChainChanged = (chainId: string) => {
        const isScrollSepolia = parseInt(chainId, 16) === 534351;
        setIsWrongNetwork(!isScrollSepolia);
        setShowBanner(!isScrollSepolia);
      };

      window.ethereum.on('chainChanged', handleChainChanged);
      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const switchNetwork = async () => {
    if (typeof window.ethereum === 'undefined') return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x8274F' }], // 534351 in hex
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x8274F',
              chainName: 'Scroll Sepolia',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia-rpc.scroll.io/'],
              blockExplorerUrls: ['https://sepolia.scrollscan.com/'],
            }],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
  };

  if (!showBanner || !isWrongNetwork) return null;

  return (
    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
      <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span className="text-orange-800 dark:text-orange-200">
          Please switch to Scroll Sepolia network to use this DApp
        </span>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={switchNetwork}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Switch Network
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowBanner(false)}
            className="text-orange-600 hover:text-orange-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}