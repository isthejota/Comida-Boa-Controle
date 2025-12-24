
import React, { useState, useEffect } from 'react';
import { Sale, PaymentMethod } from '../types';
import { formatCurrency, getDayName } from '../utils';
import { Trash2, CreditCard, Banknote, Calendar, AlertCircle } from 'lucide-react';

interface HistoryListProps {
  sales: Sale[];
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ sales, onDelete }) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Reset confirmation if user doesn't click for 3 seconds
  useEffect(() => {
    if (confirmDeleteId) {
      const timer = setTimeout(() => setConfirmDeleteId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmDeleteId]);

  if (sales.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-zinc-600">
        <Calendar size={64} className="mb-4 opacity-20" />
        <p className="text-lg">Nenhuma venda encontrada</p>
        <p className="text-sm">As vendas registradas aparecerão aqui.</p>
      </div>
    );
  }

  // Simple grouping by date
  const groupedSales: Record<string, Sale[]> = {};
  sales.forEach(sale => {
    const date = new Date(sale.timestamp).toLocaleDateString('pt-BR');
    if (!groupedSales[date]) groupedSales[date] = [];
    groupedSales[date].push(sale);
  });

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirmDeleteId === id) {
      onDelete(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold mb-4">Histórico de Vendas</h2>
      
      {Object.entries(groupedSales).map(([date, daySales]) => {
        const dailyTotal = daySales.reduce((sum, sale) => sum + sale.amount, 0);
        
        return (
          <div key={date} className="space-y-3">
            <div className="sticky top-0 bg-black/95 backdrop-blur-sm py-3 z-10 flex justify-between items-end border-b border-zinc-800">
              <div className="flex flex-col">
                <span className="text-zinc-500 text-[10px] uppercase font-bold leading-none mb-1">{getDayName(daySales[0].timestamp)}</span>
                <span className="text-white font-bold text-sm tracking-widest">{date}</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-500 text-[9px] uppercase font-bold block">Total do Dia</span>
                <span className="text-red-500 font-black text-lg">{formatCurrency(dailyTotal)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {daySales.map((sale) => (
                <div 
                  key={sale.id} 
                  className={`bg-zinc-900 p-4 rounded-2xl flex items-center border transition-all relative overflow-hidden ${
                    confirmDeleteId === sale.id ? 'border-red-600 ring-1 ring-red-600' : 'border-zinc-800/50'
                  }`}
                >
                  {/* Payment Icon */}
                  <div className={`p-3 rounded-xl shrink-0 ${sale.paymentMethod === PaymentMethod.PIX ? 'bg-cyan-900/20 text-cyan-400' : 'bg-green-900/20 text-green-400'}`}>
                    {sale.paymentMethod === PaymentMethod.PIX ? <CreditCard size={20} /> : <Banknote size={20} />}
                  </div>

                  {/* Info Section */}
                  <div className="ml-4 flex-1 min-w-0 pr-2">
                    <p className="text-lg font-bold text-zinc-100">{formatCurrency(sale.amount)}</p>
                    <div className="flex items-center text-[11px] text-zinc-500 leading-tight">
                      <span className="shrink-0">{new Date(sale.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="mx-1.5">•</span>
                      <span className="truncate">{sale.observation || 'Sem detalhes'}</span>
                    </div>
                  </div>
                  
                  {/* Delete/Confirm Button Area */}
                  <div className="shrink-0 flex items-center justify-end">
                    <button 
                      onClick={(e) => handleDeleteClick(e, sale.id)}
                      className={`transition-all flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-wider h-12 ${
                        confirmDeleteId === sale.id 
                          ? 'bg-red-600 text-white px-4 animate-in zoom-in-95 duration-200' 
                          : 'text-zinc-700 hover:text-red-500 px-3'
                      }`}
                    >
                      {confirmDeleteId === sale.id ? (
                        <>
                          <AlertCircle size={16} />
                          <span className="text-[10px]">Confirmar?</span>
                        </>
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryList;
