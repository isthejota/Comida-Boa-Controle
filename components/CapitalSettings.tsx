
import React, { useState } from 'react';
import { Wallet, Plus, Trash2, ArrowDownCircle } from 'lucide-react';
import { Expense } from '../types';
import { formatCurrency } from '../utils';

interface CapitalSettingsProps {
  initialValue: number;
  expenses: Expense[];
  onUpdateCapital: (amount: number) => void;
  onAddExpense: (description: string, amount: number) => void;
  onDeleteExpense: (id: string) => void;
}

const CapitalSettings: React.FC<CapitalSettingsProps> = ({ 
  initialValue, 
  expenses,
  onUpdateCapital, 
  onAddExpense, 
  onDeleteExpense 
}) => {
  // Estado para Capital Inicial
  const [rawCapital, setRawCapital] = useState((Math.round(initialValue * 100)).toString());
  
  // Estado para Nova Saída
  const [expenseDesc, setExpenseDesc] = useState('');
  const [rawExpenseAmount, setRawExpenseAmount] = useState('');

  const handleCapitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setRawCapital(val);
    onUpdateCapital(parseInt(val || '0') / 100);
  };

  const handleExpenseAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setRawExpenseAmount(val);
  };

  const getDisplayValue = (raw: string) => {
    if (!raw || raw === '0') return '0,00';
    return (parseInt(raw) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleAddExpense = () => {
    const amount = parseInt(rawExpenseAmount || '0') / 100;
    if (amount > 0 && expenseDesc.trim()) {
      onAddExpense(expenseDesc, amount);
      setExpenseDesc('');
      setRawExpenseAmount('');
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-left-4 duration-300 pb-12">
      {/* Capital Inicial */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="bg-zinc-900 p-3 rounded-xl">
            <Wallet size={24} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Capital Inicial</h2>
            <p className="text-zinc-500 text-xs uppercase tracking-tighter">Abertura de Caixa</p>
          </div>
        </div>
        
        <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800">
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-zinc-400">R$</span>
            <input 
              type="text"
              inputMode="numeric"
              value={getDisplayValue(rawCapital)}
              onChange={handleCapitalChange}
              className="w-full bg-black border-2 border-zinc-800 focus:border-red-600 rounded-2xl py-4 pl-16 pr-6 text-3xl font-bold text-white outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Adicionar Nova Saída */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="bg-zinc-900 p-3 rounded-xl">
            <ArrowDownCircle size={24} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Nova Saída</h2>
            <p className="text-zinc-500 text-xs uppercase tracking-tighter">Gelos, Bebidas, Carvão, etc</p>
          </div>
        </div>

        <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 space-y-4">
          <input 
            type="text"
            placeholder="Descrição da despesa"
            value={expenseDesc}
            onChange={(e) => setExpenseDesc(e.target.value)}
            className="w-full bg-black border-2 border-zinc-800 focus:border-red-600 rounded-xl py-3 px-4 text-white outline-none"
          />
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">R$</span>
              <input 
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                value={getDisplayValue(rawExpenseAmount)}
                onChange={handleExpenseAmountChange}
                className="w-full bg-black border-2 border-zinc-800 focus:border-red-600 rounded-xl py-3 pl-10 pr-4 text-xl font-bold text-white outline-none"
              />
            </div>
            <button 
              onClick={handleAddExpense}
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition-colors active:scale-95"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Lista de Saídas */}
      {expenses.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest px-2">Lista de Saídas</h3>
          <div className="space-y-2">
            {expenses.map((expense) => (
              <div key={expense.id} className="bg-zinc-900/50 p-4 rounded-2xl flex justify-between items-center border border-zinc-800">
                <div>
                  <p className="font-bold text-white">{expense.description}</p>
                  <p className="text-xs text-zinc-500">{new Date(expense.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-red-400 font-bold">{formatCurrency(expense.amount)}</span>
                  <button 
                    onClick={() => onDeleteExpense(expense.id)}
                    className="text-zinc-700 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CapitalSettings;
