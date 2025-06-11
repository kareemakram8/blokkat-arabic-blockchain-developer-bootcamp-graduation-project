'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { CausesList } from '@/components/causes-list';
import { CreateCauseDialog } from '@/components/create-cause-dialog';
import { NetworkBanner } from '@/components/network-banner';
import { WalletProvider } from '@/contexts/wallet-context';

export default function Home() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <NetworkBanner />
        <Header />
        <main>
          <Hero />
          <CausesList />
        </main>
        <CreateCauseDialog />
      </div>
    </WalletProvider>
  );
}