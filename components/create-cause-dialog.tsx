'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateCauseForm } from '@/components/create-cause-form';
import { useWallet } from '@/contexts/wallet-context';

export function CreateCauseDialog() {
  const [open, setOpen] = useState(false);
  const { isConnected } = useWallet();

  if (!isConnected) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="fixed bottom-8 right-8 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Cause</DialogTitle>
        </DialogHeader>
        <CreateCauseForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}