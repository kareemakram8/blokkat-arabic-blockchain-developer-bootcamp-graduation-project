'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/wallet-context';
import { CauseCard } from '@/components/cause-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

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

export function CausesList() {
  const { contract, isConnected } = useWallet();
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  const loadCauses = async () => {
    if (!contract) return;

    setLoading(true);
    try {
      const currentId = await contract.getCurrentCauseId();
      const causesData: Cause[] = [];

      for (let i = 1; i < currentId; i++) {
        try {
          const cause = await contract.causes(i);
          causesData.push({
            id: i,
            title: cause.title,
            description: cause.description,
            owner: cause.owner,
            totalDonations: cause.totalDonations,
            targetAmount: cause.targetAmount,
            isActive: cause.isActive,
            createdAt: cause.createdAt,
          });
        } catch (error) {
          console.error(`Error loading cause ${i}:`, error);
        }
      }

      setCauses(causesData);
    } catch (error) {
      console.error('Error loading causes:', error);
      toast.error('Failed to load causes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && contract) {
      loadCauses();
    }
  }, [contract, isConnected]);

  const filteredCauses = causes.filter(cause => {
    const matchesSearch = cause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cause.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = showActiveOnly ? cause.isActive : true;
    return matchesSearch && matchesFilter;
  });

  if (!isConnected) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Please connect your wallet to view and interact with causes
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">Active Causes</h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search causes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Button
              variant={showActiveOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowActiveOnly(!showActiveOnly)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showActiveOnly ? 'Active Only' : 'All Causes'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredCauses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCauses.map((cause) => (
              <CauseCard key={cause.id} cause={cause} onUpdate={loadCauses} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchTerm ? 'No causes found matching your search.' : 'No causes available yet.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}