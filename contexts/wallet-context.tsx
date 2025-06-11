'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

interface WalletContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contract: ethers.Contract | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Contract ABI - Matches your deployed contract
const CONTRACT_ABI = [
  "function createCause(string memory _title, string memory _description, uint256 _targetAmount) external returns (uint256 causeId)",
  "function donateToCause(uint256 _causeId) external payable",
  "function withdrawFunds(uint256 _causeId) external",
  "function deactivateCause(uint256 _causeId) external",
  "function causes(uint256) external view returns (uint256 id, string title, string description, address owner, uint256 totalDonations, uint256 targetAmount, bool isActive, uint256 createdAt)",
  "function getDonationHistory(uint256 _causeId) external view returns (uint256[] memory donations, address[] memory donors)",
  "function getDonationCount(uint256 _causeId) external view returns (uint256 count)",
  "function getCurrentCauseId() external view returns (uint256)",
  "function getCauseStatus(uint256 _causeId) external view returns (bool exists, bool active)",
  "function ownerCauseCount(address) external view returns (uint256)",
  "function MIN_DONATION() external view returns (uint256)",
  "function MAX_CAUSES_PER_OWNER() external view returns (uint256)",
  "event CauseCreated(uint256 indexed causeId, address indexed owner, string title, uint256 targetAmount)",
  "event DonationMade(uint256 indexed causeId, address indexed donor, uint256 amount, uint256 totalDonations)",
  "event FundsWithdrawn(uint256 indexed causeId, address indexed owner, uint256 amount)",
  "event CauseDeactivated(uint256 indexed causeId, address indexed owner)"
];

// Your deployed contract address on Scroll Sepolia
const CONTRACT_ADDRESS = "0x742d35Cc6641C5532C5175C18cB8A6B7CC5e9999";

// Scroll Sepolia network configuration
const SCROLL_SEPOLIA_NETWORK = {
  chainId: '0x8274F', // 534351 in hex
  chainName: 'Scroll Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia-rpc.scroll.io/'],
  blockExplorerUrls: ['https://sepolia.scrollscan.com/'],
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isConnected = !!account;

  const switchToScrollSepolia = async () => {
    if (typeof window.ethereum === 'undefined') return false;

    try {
      // Try to switch to Scroll Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SCROLL_SEPOLIA_NETWORK.chainId }],
      });
      return true;
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SCROLL_SEPOLIA_NETWORK],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add Scroll Sepolia network:', addError);
          toast.error('Failed to add Scroll Sepolia network');
          return false;
        }
      } else {
        console.error('Failed to switch to Scroll Sepolia:', switchError);
        toast.error('Failed to switch to Scroll Sepolia network');
        return false;
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('Please install MetaMask to use this application');
      return;
    }

    setIsConnecting(true);
    try {
      // First, switch to Scroll Sepolia network
      const networkSwitched = await switchToScrollSepolia();
      if (!networkSwitched) {
        setIsConnecting(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      // Verify we're on the correct network
      const network = await provider.getNetwork();
      if (network.chainId !== 534351n) {
        toast.error('Please switch to Scroll Sepolia network');
        setIsConnecting(false);
        return;
      }
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      setContract(contract);
      
      toast.success('Wallet connected successfully to Scroll Sepolia!');
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    toast.success('Wallet disconnected');
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        // Convert hex chainId to decimal
        const decimalChainId = parseInt(chainId, 16);
        if (decimalChainId !== 534351) {
          toast.warning('Please switch back to Scroll Sepolia network');
          disconnectWallet();
        } else {
          // Reconnect if we're back on the correct network
          if (account) {
            window.location.reload();
          }
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account]);

  const value: WalletContextType = {
    account,
    provider,
    signer,
    contract,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}