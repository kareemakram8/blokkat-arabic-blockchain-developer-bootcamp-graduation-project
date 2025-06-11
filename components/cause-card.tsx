'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/wallet-context';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { Heart, User, Calendar, DollarSign, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Cause {
  id: number;
  title: string;
  description: string;
  owner: string;
  totalDonations: bigint;
  targetAmount: bigint;
  isActive: boolean;
  createdAt: bigint;
}

interface CauseCardProps {
  cause: Cause;
  onUpdate: () => void;
}

export function CauseCard({ cause, onUpdate }: CauseCardProps) {
  const { contract, account } = useWallet();
  const [donationAmount, setDonationAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatEther = (wei: bigint) => {
    return parseFloat(ethers.formatEther(wei)).toFixed(4);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const progressPercentage = cause.targetAmount > 0n 
    ? Math.min((Number(cause.totalDonations) / Number(cause.targetAmount)) * 100, 100)
    : 0;

  const isOwner = account?.toLowerCase() === cause.owner.toLowerCase();

  const handleDonate = async () => {
    if (!contract || !donationAmount) return;

    try {
      const amount = ethers.parseEther(donationAmount);
      setIsLoading(true);

      const tx = await contract.donateToCause(cause.id, { value: amount });
      toast.loading('Processing donation...', { id: 'donation' });
      
      await tx.wait();
      toast.success('Donation successful!', { id: 'donation' });
      
      setDonationAmount('');
      onUpdate();
    } catch (error: any) {
      console.error('Donation failed:', error);
      toast.error(error.reason || 'Donation failed', { id: 'donation' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!contract) return;

    try {
      setIsLoading(true);
      const tx = await contract.withdrawFunds(cause.id);
      toast.loading('Processing withdrawal...', { id: 'withdraw' });
      
      await tx.wait();
      toast.success('Funds withdrawn successfully!', { id: 'withdraw' });
      
      onUpdate();
    } catch (error: any) {
      console.error('Withdrawal failed:', error);
      toast.error(error.reason || 'Withdrawal failed', { id: 'withdraw' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!contract) return;

    try {
      setIsLoading(true);
      const tx = await contract.deactivateCause(cause.id);
      toast.loading('Deactivating cause...', { id: 'deactivate' });
      
      await tx.wait();
      toast.success('Cause deactivated successfully!', { id: 'deactivate' });
      
      onUpdate();
    } catch (error: any) {
      console.error('Deactivation failed:', error);
      toast.error(error.reason || 'Deactivation failed', { id: 'deactivate' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{cause.title}</CardTitle>
          <Badge variant={cause.isActive ? "default" : "secondary"}>
            {cause.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {cause.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium">{formatEther(cause.totalDonations)} ETH</p>
                <p className="text-muted-foreground">Raised</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-600" />
              <div>
                <p className="font-medium">{formatEther(cause.targetAmount)} ETH</p>
                <p className="text-muted-foreground">Goal</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{formatAddress(cause.owner)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(cause.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        {isOwner ? (
          <div className="w-full space-y-2">
            {cause.totalDonations > 0n && (
              <Button 
                onClick={handleWithdraw} 
                disabled={isLoading}
                className="w-full"
              >
                Withdraw {formatEther(cause.totalDonations)} ETH
              </Button>
            )}
            {cause.isActive && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deactivate Cause
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deactivate Cause</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to deactivate this cause? This action cannot be undone.
                      You can still withdraw any remaining funds after deactivation.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeactivate} disabled={isLoading}>
                      Deactivate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        ) : cause.isActive ? (
          <div className="w-full space-y-2">
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Amount in ETH"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                step="0.001"
                min="0.001"
              />
              <Button 
                onClick={handleDonate} 
                disabled={isLoading || !donationAmount}
              >
                Donate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum donation: 0.001 ETH
            </p>
          </div>
        ) : (
          <div className="w-full text-center text-muted-foreground">
            This cause is no longer accepting donations
          </div>
        )}
      </CardFooter>
    </Card>
  );
}