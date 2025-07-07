
import React from 'react';
import { Wallet } from 'lucide-react';
import CurrencySelector from './CurrencySelector';
import NotificationCenter from './NotificationCenter';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Auto Fund
              </h1>
              <p className="text-xs text-slate-500">Financial Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <CurrencySelector />
            <NotificationCenter />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
