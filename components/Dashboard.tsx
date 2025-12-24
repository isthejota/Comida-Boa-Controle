
import React from 'react';
import { DashboardStats } from '../types';
import { formatCurrency } from '../utils';
import { TrendingUp, TrendingDown, ShoppingBag, CreditCard } from 'lucide-react';

interface DashboardProps {
  stats: DashboardStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const isProfitable = stats.profit >= 0;
  const totalOut = stats.initialCapital + stats.totalExpenses;
  const totalIn = stats.totalPix + stats.totalCash;
  
  // Meta calculation: How much of the costs have been covered by sales
  // 100% means you've reached "break-even" (ponto de equilíbrio)
  const metaPercentage = totalOut > 0 ? Math.min(Math.max((totalIn / totalOut) * 100, 0), 100) : (totalIn > 0 ? 100 : 0);
  
  const radius = 30;
  const strokeDasharray = 2 * Math.PI * radius; 
  const strokeDashoffset = strokeDasharray - (metaPercentage / 100) * strokeDasharray;

  // Distribution bar
  const pixPercent = totalIn > 0 ? (stats.totalPix / totalIn) * 100 : 50;

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Principal Summary Card - Refined Layout */}
      <div className="bg-zinc-900 rounded-[2.5rem] p-6 border border-zinc-800 shadow-xl relative overflow-hidden">
        {/* Subtle background glow based on profit */}
        <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 -mr-10 -mt-10 rounded-full ${isProfitable ? 'bg-yellow-500' : 'bg-red-900'}`} />
        
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="flex-1 space-y-1">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Lucro Líquido</p>
            <h2 className={`text-3xl font-black tracking-tight ${isProfitable ? 'text-yellow-400' : 'text-red-600'}`}>
              {formatCurrency(stats.profit)}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className={`p-1 rounded-md ${isProfitable ? 'bg-yellow-400/10' : 'bg-red-600/10'}`}>
                {isProfitable ? <TrendingUp size={14} className="text-yellow-400" /> : <TrendingDown size={14} className="text-red-600" />}
              </div>
              <span className="text-[11px] text-zinc-400 font-medium">Investimento: {formatCurrency(totalOut)}</span>
            </div>
          </div>

          {/* Goal Circle - Better Sized and Positioned */}
          <div className="relative w-30 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 drop-shadow-lg">
              <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="7" fill="transparent" className="text-zinc-800" />
              <circle 
                cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="7" fill="transparent" 
                strokeDasharray={strokeDasharray} 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round"
                className={`${metaPercentage >= 100 ? 'text-yellow-400' : 'text-red-600'} transition-all duration-1000 ease-out`} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center leading-none text-center">
              <span className="text-[10px] uppercase text-zinc-500 font-black tracking-widest mb-1">Meta</span>
              <span className="text-xl font-black text-white">{Math.round(metaPercentage)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Sales Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800">
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Vendido Hoje</p>
          <p className="text-xl font-bold text-white">{formatCurrency(stats.totalSalesToday)}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800">
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Total FDS</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(stats.totalSalesWeekend)}</p>
        </div>
      </div>

      {/* Payment Distribution Bar Chart */}
      <div className="bg-zinc-900 p-5 rounded-[2rem] border border-zinc-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Meios de Pagamento</p>
            <h3 className="text-sm font-bold text-zinc-300">{stats.salesCount} vendas totais</h3>
          </div>
          <div className="bg-zinc-800 px-3 py-1 rounded-full">
             <p className="text-[10px] font-black text-zinc-400">DISTRIBUIÇÃO</p>
          </div>
        </div>

        <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden flex">
          <div 
            style={{ width: `${pixPercent}%` }} 
            className="h-full bg-red-600 transition-all duration-1000 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
          />
          <div 
            style={{ width: `${100 - pixPercent}%` }} 
            className="h-full bg-zinc-600 transition-all duration-1000"
          />
        </div>

        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
          <div className="flex items-center gap-2 text-red-500 bg-red-500/5 px-2 py-1 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span>PIX ({formatCurrency(stats.totalPix)})</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 bg-zinc-500/5 px-2 py-1 rounded-lg">
            <span>DINHEIRO ({formatCurrency(stats.totalCash)})</span>
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          </div>
        </div>
      </div>

      {/* Footer Secondary Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-900">
          <div className="bg-red-950/30 p-2 rounded-lg text-red-500"><ShoppingBag size={18} /></div>
          <div>
            <p className="text-[9px] text-zinc-500 uppercase font-black">Saídas Extras</p>
            <p className="text-xs font-bold text-zinc-300">{formatCurrency(stats.totalExpenses)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-900">
          <div className="bg-zinc-800/50 p-2 rounded-lg text-zinc-400"><CreditCard size={18} /></div>
          <div>
            <p className="text-[9px] text-zinc-500 uppercase font-black">Ticket Médio</p>
            <p className="text-xs font-bold text-zinc-300">
              {stats.salesCount > 0 ? formatCurrency((stats.totalPix + stats.totalCash) / stats.salesCount) : 'R$ 0,00'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
