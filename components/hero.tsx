'use client';

import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/wallet-context';
import { Heart, Users, DollarSign, Shield } from 'lucide-react';

export function Hero() {
  const { isConnected, connectWallet } = useWallet();

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Decentralized Charity
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Create transparent causes, donate with confidence, and make a real impact 
            through blockchain technology
          </p>
          
          {!isConnected && (
            <Button 
              size="lg" 
              onClick={connectWallet}
              className="mb-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              <Heart className="mr-2 h-5 w-5" />
              Start Making a Difference
            </Button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Transparent</h3>
              <p className="text-sm text-muted-foreground">
                All donations are recorded on the blockchain for complete transparency
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Low Fees</h3>
              <p className="text-sm text-muted-foreground">
                Direct donations with minimal transaction fees
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">
                Join a global community of changemakers
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold mb-2">Impact</h3>
              <p className="text-sm text-muted-foreground">
                Make a real difference in causes you care about
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}