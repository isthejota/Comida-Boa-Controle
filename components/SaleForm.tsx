
import React, { useState } from 'react';
import { PaymentMethod, Sale } from '../types';
import { X, Check, CreditCard, Banknote, Plus, Minus, GlassWater, Beer } from 'lucide-react';

interface SaleFormProps {
  onSave: (sale: Omit<Sale, 'id' | 'timestamp'>) => void;
  onCancel: () => void;
}

const DRINK_OPTIONS = [
  { id: 'suco', label: 'Suco' },
  { id: 'refri_lat_f', label: 'Refri Latinha' },
  { id: 'refri_1l', label: 'Refri 1L' },
  { id: 'refri_2l', label: 'Refri 2L' },
];

const SaleForm: React.FC<SaleFormProps> = ({ onSave, onCancel }) => {
  // Armazena apenas os dígitos digitados (ex: "1250" para R$ 12,50)
  const [rawAmount, setRawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.PIX);
  const [skewerCount, setSkewerCount] = useState(0);
  const [drinkQuantities, setDrinkQuantities] = useState<Record<string, number>>({
    suco: 0,
    refri_lat_f: 0,
    refri_1l: 0,
    refri_2l: 0,
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    // Limita a 8 dígitos para evitar estouro de valor
    if (value.length <= 8) {
      setRawAmount(value);
    }
  };

  const getDisplayAmount = () => {
    if (!rawAmount) return '0,00';
    const amount = parseInt(rawAmount) / 100;
    return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const updateDrinkQuantity = (id: string, delta: number) => {
    setDrinkQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseInt(rawAmount) / 100;
    if (!rawAmount || numericAmount <= 0) return;

    // Constrói a descrição baseada nas categorias selecionadas
    const observationParts = [];
    if (skewerCount > 0) {
      observationParts.push(`${skewerCount} Espetinho(s)`);
    }

    const drinkParts = DRINK_OPTIONS
      .filter(opt => drinkQuantities[opt.id] > 0)
      .map(opt => `${drinkQuantities[opt.id]}x ${opt.label}`);

    if (drinkParts.length > 0) {
      observationParts.push(`Bebidas: ${drinkParts.join(', ')}`);
    }
    
    const finalDescription = observationParts.join(' • ') || 'Venda simples';

    setIsSuccess(true);
    setTimeout(() => {
      onSave({
        amount: numericAmount,
        paymentMethod,
        observation: finalDescription
      });
    }, 800);
  };

  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-900/40">
          <Check size={48} color="white" strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-bold mb-2">Venda Registrada!</h2>
        <p className="text-zinc-500">Seu dashboard foi atualizado.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-right-4 duration-300 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Nova Venda</h2>
        <button onClick={onCancel} className="p-2 text-zinc-500"><X size={24} /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Valor da Venda */}
        <div>
          <label className="block text-zinc-500 text-sm font-bold uppercase mb-2">Valor da Venda</label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-zinc-400">R$</span>
            <input 
              type="text"
              inputMode="numeric"
              value={getDisplayAmount()}
              onChange={handleAmountChange}
              placeholder="0,00"
              autoFocus
              className="w-full bg-zinc-900 border-2 border-zinc-800 focus:border-red-600 rounded-3xl py-6 pl-16 pr-6 text-4xl font-bold text-white placeholder-zinc-700 outline-none transition-all"
            />
          </div>
        </div>

        {/* Forma de Pagamento */}
        <div>
          <label className="block text-zinc-500 text-sm font-bold uppercase mb-2">Forma de Pagamento</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod(PaymentMethod.PIX)}
              className={`flex items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all ${paymentMethod === PaymentMethod.PIX ? 'border-red-600 bg-red-600/10 text-red-600' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}
            >
              <CreditCard size={24} />
              <span className="font-bold uppercase tracking-wide">PIX</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod(PaymentMethod.CASH)}
              className={`flex items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all ${paymentMethod === PaymentMethod.CASH ? 'border-red-600 bg-red-600/10 text-red-600' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}
            >
              <Banknote size={24} />
              <span className="font-bold uppercase tracking-wide">Dinheiro</span>
            </button>
          </div>
        </div>

        {/* Quantidade de Espetinhos */}
        <div>
          <label className="block text-zinc-500 text-sm font-bold uppercase mb-2">Quantidade de Espetinhos</label>
          <div className="flex items-center justify-between bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-4">
            <button 
              type="button"
              onClick={() => setSkewerCount(Math.max(0, skewerCount - 1))}
              className="p-4 bg-zinc-800 rounded-xl hover:bg-zinc-700 active:scale-95 transition-all text-white"
            >
              <Minus size={20} />
            </button>
            <div className="text-center">
              <span className="text-3xl font-black text-white">{skewerCount}</span>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Unidades</p>
            </div>
            <button 
              type="button"
              onClick={() => setSkewerCount(skewerCount + 1)}
              className="p-4 bg-red-600/20 text-red-600 rounded-xl hover:bg-red-600/30 active:scale-95 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Seleção de Bebidas com Quantidade */}
        <div>
          <label className="block text-zinc-500 text-sm font-bold uppercase mb-2">Bebidas Vendidas</label>
          <div className="grid grid-cols-1 gap-3">
            {DRINK_OPTIONS.map(option => (
              <div
                key={option.id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  drinkQuantities[option.id] > 0 
                  ? 'border-yellow-500 bg-yellow-500/10' 
                  : 'border-zinc-800 bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={drinkQuantities[option.id] > 0 ? 'text-yellow-500' : 'text-zinc-500'}>
                    {option.id === 'suco' ? <GlassWater size={20} /> : <Beer size={20} />}
                  </div>
                  <span className={`font-bold ${drinkQuantities[option.id] > 0 ? 'text-white' : 'text-zinc-500'}`}>
                    {option.label}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 bg-black/40 p-1 rounded-lg">
                  <button 
                    type="button"
                    onClick={() => updateDrinkQuantity(option.id, -1)}
                    className="p-2 text-zinc-400 hover:text-white"
                  >
                    <Minus size={16} />
                  </button>
                  <span className={`w-6 text-center font-black ${drinkQuantities[option.id] > 0 ? 'text-yellow-500' : 'text-zinc-600'}`}>
                    {drinkQuantities[option.id]}
                  </span>
                  <button 
                    type="button"
                    onClick={() => updateDrinkQuantity(option.id, 1)}
                    className="p-2 text-yellow-500 hover:text-yellow-400"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão Registrar */}
        <button
          type="submit"
          disabled={!rawAmount || parseInt(rawAmount) === 0}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:bg-zinc-800 text-white font-black text-xl py-6 rounded-3xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          REGISTRAR VENDA
        </button>
      </form>
    </div>
  );
};

export default SaleForm;
