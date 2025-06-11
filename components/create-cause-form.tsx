'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/contexts/wallet-context';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CreateCauseFormProps {
  onSuccess?: () => void;
}

export function CreateCauseForm({ onSuccess }: CreateCauseFormProps) {
  const { contract } = useWallet();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    try {
      setIsLoading(true);
      const targetAmountWei = ethers.parseEther(formData.targetAmount);
      
      const tx = await contract.createCause(
        formData.title,
        formData.description,
        targetAmountWei
      );
      
      toast.loading('Creating cause...', { id: 'create-cause' });
      await tx.wait();
      
      toast.success('Cause created successfully!', { id: 'create-cause' });
      
      setFormData({ title: '', description: '', targetAmount: '' });
      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to create cause:', error);
      toast.error(error.reason || 'Failed to create cause', { id: 'create-cause' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create New Cause</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter cause title"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your cause and how donations will be used"
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="targetAmount">Target Amount (ETH)</Label>
          <Input
            id="targetAmount"
            type="number"
            step="0.001"
            min="0.001"
            value={formData.targetAmount}
            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
            placeholder="0.1"
            required
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Creating...' : 'Create Cause'}
        </Button>
      </form>
    </DialogContent>
  );
}