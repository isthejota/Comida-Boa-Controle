
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Wallet, 
  History, 
} from 'lucide-react';
import { AppData, Sale, PaymentMethod, DashboardStats, Expense } from './types';
import { STORAGE_KEY } from './constants';
import { isToday, isWeekend } from './utils';

// Components
import Dashboard from './components/Dashboard';
import SaleForm from './components/SaleForm';
import CapitalSettings from './components/CapitalSettings';
import HistoryList from './components/HistoryList';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'register' | 'capital' | 'history'>('dashboard');
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    // Migração simples para novas instalações ou versões antigas
    const parsed = saved ? JSON.parse(saved) : null;
    return parsed ? {
      initialCapital: parsed.initialCapital || 0,
      sales: parsed.sales || [],
      expenses: parsed.expenses || []
    } : { initialCapital: 0, sales: [], expenses: [] };
  });

  // Persist data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Calculations
  const stats = useMemo<DashboardStats>(() => {
    const sales = data.sales;
    const expenses = data.expenses;
    let totalSalesToday = 0;
    let totalSalesWeekend = 0;
    let totalPix = 0;
    let totalCash = 0;

    sales.forEach(sale => {
      if (isToday(sale.timestamp)) {
        totalSalesToday += sale.amount;
      }
      if (isWeekend(sale.timestamp)) {
        totalSalesWeekend += sale.amount;
      }
      if (sale.paymentMethod === PaymentMethod.PIX) {
        totalPix += sale.amount;
      } else {
        totalCash += sale.amount;
      }
    });

    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const totalRevenue = totalPix + totalCash;
    const profit = totalRevenue - (data.initialCapital + totalExpenses);

    return {
      initialCapital: data.initialCapital,
      totalSalesToday,
      totalSalesWeekend,
      totalPix,
      totalCash,
      totalExpenses,
      profit,
      salesCount: sales.length
    };
  }, [data]);

  const addSale = (sale: Omit<Sale, 'id' | 'timestamp'>) => {
    const newSale: Sale = {
      ...sale,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    setData(prev => ({
      ...prev,
      sales: [newSale, ...prev.sales]
    }));
    setActiveTab('dashboard');
  };

  const deleteSale = (id: string) => {
    setData(prev => ({
      ...prev,
      sales: prev.sales.filter(s => s.id !== id)
    }));
  };

  const updateCapital = (amount: number) => {
    setData(prev => ({ ...prev, initialCapital: amount }));
  };

  const addExpense = (description: string, amount: number) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description,
      amount,
      timestamp: Date.now()
    };
    setData(prev => ({
      ...prev,
      expenses: [newExpense, ...prev.expenses]
    }));
  };

  const deleteExpense = (id: string) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id)
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} />;
      case 'register':
        return <SaleForm onSave={addSale} onCancel={() => setActiveTab('dashboard')} />;
      case 'capital':
        return (
          <CapitalSettings 
            initialValue={data.initialCapital} 
            expenses={data.expenses}
            onUpdateCapital={updateCapital} 
            onAddExpense={addExpense}
            onDeleteExpense={deleteExpense}
          />
        );
      case 'history':
        return <HistoryList sales={data.sales} onDelete={deleteSale} />;
      default:
        return <Dashboard stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-zinc-900">
      <header className="p-6 pt-10 border-b border-zinc-900 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CB<span className="text-red-600"> Controle</span></h1>
          <p className="text-zinc-500 text-sm">Controle de Vendas</p>
        </div>
        <button 
          onClick={() => setActiveTab('history')}
          className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors"
        >
          <History size={20} className="text-zinc-400" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 w-full max-w-md bg-zinc-950 border-t border-zinc-900 flex justify-around items-center p-4 z-50">
        <NavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<LayoutDashboard size={24} />} 
          label="Dashboard" 
        />
        <button 
          onClick={() => setActiveTab('register')}
          className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center -mt-12 border-4 border-black shadow-lg hover:bg-red-700 active:scale-95 transition-all"
        >
          <PlusCircle size={32} color="white" />
        </button>
        <NavButton 
          active={activeTab === 'capital'} 
          onClick={() => setActiveTab('capital')} 
          icon={<Wallet size={24} />} 
          label="Capital" 
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-red-600' : 'text-zinc-500'}`}
  >
    {icon}
    <span className="text-[10px] uppercase font-semibold">{label}</span>
  </button>
);

export default App;
