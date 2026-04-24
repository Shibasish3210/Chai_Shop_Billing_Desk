/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  ShoppingCart, 
  Plus, 
  Settings, 
  Trash2, 
  ChevronRight, 
  X,
  CheckCircle2,
  Trash,
  Minus,
  LayoutGrid
} from 'lucide-react';
import { DEFAULT_ITEMS, CATEGORY_COLORS } from './constants';
import { Item, CartItem, Order, DailySummary } from './types';
import { storage, calculateItemTotal } from './storage';

export default function App() {
  const [view, setView] = useState<'billing' | 'summary' | 'settings'>('billing');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customItems, setCustomItems] = useState<Item[]>([]);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  // Load custom items on mount
  useEffect(() => {
    setCustomItems(storage.getCustomItems());
  }, []);

  const allItems = useMemo(() => [...DEFAULT_ITEMS, ...customItems], [customItems]);

  const addToCart = (item: Item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + calculateItemTotal(item), 0);
  }, [cart]);

  const undoLastItem = () => {
    setCart(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (last.quantity > 1) {
        return prev.map((item, idx) => idx === prev.length - 1 ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.slice(0, -1);
    });
  };

  const handleCompleteOrder = () => {
    if (cart.length === 0) return;

    const order: Order = {
      id: Math.random().toString(36).substring(7),
      items: [...cart],
      total: cartTotal,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
    };

    storage.saveOrder(order);
    clearCart();
    setShowOrderSuccess(true);
    setTimeout(() => setShowOrderSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans flex flex-col md:flex-row max-w-[1400px] mx-auto overflow-hidden">
      
      {/* Sidebar (Cart) on Desktop / Main Cart on Mobile */}
      <aside className={`w-full md:w-[320px] bg-white md:border-r-2 border-slate-200 flex flex-col fixed inset-0 md:relative z-40 transition-transform ${view === 'billing' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${view !== 'billing' && 'hidden md:flex'}`}>
        <div className="p-6 border-b-2 border-slate-100 flex flex-col gap-1">
          <div className="flex justify-between items-baseline">
            <h1 className="text-2xl font-[900] tracking-tighter text-[#0F172A]">CHAI POINT</h1>
            <span className="text-sm text-slate-500 font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
              <ShoppingCart size={48} strokeWidth={1.5} />
              <p className="font-medium">Order is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <span className="bg-[#F1F5F9] px-2.5 py-1 rounded-lg font-bold text-sm text-[#0F172A]">{item.quantity}</span>
                  <p className="font-medium text-sm text-[#1E293B]">{item.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">₹{calculateItemTotal(item)}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-slate-100 rounded text-slate-400"><Minus size={14}/></button>
                    <button onClick={() => addToCart(item)} className="p-1 hover:bg-slate-100 rounded text-slate-400"><Plus size={14}/></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 mt-auto border-t-[4px] border-double border-slate-200 bg-white">
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-[900] text-[#0F172A]">Total</span>
            <span className="text-3xl font-[900] text-[#0F172A]">₹{cartTotal}</span>
          </div>
          <button
            disabled={cart.length === 0}
            onClick={handleCompleteOrder}
            className={`w-full py-6 rounded-[20px] font-bold text-xl transition-all shadow-lg ${
              cart.length > 0 
                ? 'bg-[#2563EB] text-white shadow-blue-200 active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            COMPLETE ORDER
          </button>
          
          {/* Mobile Tab Swither (Hidden on Desktop) */}
          <div className="flex md:hidden mt-6 gap-2">
            <button onClick={() => setView('summary')} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-sm">Daily Summary</button>
            <button onClick={() => setView('settings')} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-sm">Settings</button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col h-screen">
        {/* Top bar for non-billing views or mobile navigation */}
        <div className="p-6 md:p-8 flex justify-between items-center bg-[#F8FAFC]">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {view === 'billing' ? 'Select Items' : view.toUpperCase()}
            </h2>
          </div>
          <div className="hidden md:flex gap-3">
            <button onClick={() => setView('billing')} className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${view === 'billing' ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white text-slate-600 border-slate-200'}`}>Billing</button>
            <button onClick={() => setView('summary')} className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${view === 'summary' ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white text-slate-600 border-slate-200'}`}>Daily Summary</button>
            <button onClick={() => setView('settings')} className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${view === 'settings' ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white text-slate-600 border-slate-200'}`}>+ New Item</button>
          </div>
          {view !== 'billing' && (
             <button onClick={() => setView('billing')} className="md:hidden bg-[#0F172A] text-white px-4 py-2 rounded-lg text-sm font-bold">Back to Billing</button>
          )}
        </div>

        <div className="flex-1 p-6 md:p-8 pt-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            {view === 'billing' && (
              <motion.div 
                key="billing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 flex flex-col h-full"
              >
                {/* Items Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 align-content-start overflow-y-auto">
                  {allItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className={`${item.color} p-5 rounded-[16px] text-white shadow-md active:scale-95 active:opacity-70 transition-all flex flex-col items-center justify-center text-center`}
                    >
                      <span className="text-[18px] font-extrabold uppercase tracking-tight mb-1">{item.name}</span>
                      <span className="text-[16px] font-medium opacity-90">₹{item.price}</span>
                    </button>
                  ))}
                </div>

                {/* Bottom Summary Bar (Desktop) */}
                <div className="hidden md:flex bg-[#0F172A] text-white p-4 px-6 rounded-xl justify-between items-center mt-auto">
                    <DailyStats />
                </div>
              </motion.div>
            )}

            {view === 'summary' && <SummaryView />}
            {view === 'settings' && <SettingsView onAdd={() => setCustomItems(storage.getCustomItems())} />}
          </AnimatePresence>
        </div>
      </main>

      {/* Success Notification */}
      <AnimatePresence>
        {showOrderSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-white shadow-2xl rounded-2xl p-4 flex items-center gap-4 border border-emerald-100"
          >
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-bold">Order Saved!</p>
              <p className="text-sm text-slate-500">Cart cleared successfully.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DailyStats() {
  const [stats, setStats] = useState<DailySummary | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStats(storage.getDailySummary(today));
  }, []);

  if (!stats) return null;

  return (
    <>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Sales Today</span>
        <span className="text-lg font-bold text-[#10B981]">₹{stats.totalSales}</span>
      </div>
      <div className="flex flex-col border-l border-slate-700 pl-6">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Orders</span>
        <span className="text-lg font-bold text-[#10B981]">{stats.totalOrders}</span>
      </div>
      <div className="flex flex-col border-l border-slate-700 pl-6">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Tea Sold</span>
        <span className="text-lg font-bold text-[#10B981]">{Object.entries(stats.itemCounts).filter(([name]) => name.toLowerCase().includes('tea')).reduce((acc, [_, count]) => acc + (count as number), 0)}</span>
      </div>
      <div className="flex flex-col border-l border-slate-700 pl-6">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Current Hour</span>
        <span className="text-lg font-bold text-[#10B981]">₹{stats.hourlySales[new Date().getHours()] || 0}</span>
      </div>
    </>
  );
}

function SummaryView() {
  const [summary, setSummary] = useState<DailySummary | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSummary(storage.getDailySummary(today));
  }, []);

  if (!summary) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-12"
    >
      <div>
        <h1 className="text-3xl font-[900] tracking-tighter text-[#0F172A]">DAILY SUMMARY</h1>
        <p className="text-slate-500 font-medium uppercase text-xs tracking-widest">{new Date().toLocaleDateString(undefined, { dateStyle: 'full' })}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[24px] border-2 border-slate-100 shadow-sm">
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-2">Total Sales</p>
          <div className="text-4xl font-[900] text-[#10B981]">₹{summary.totalSales}</div>
        </div>
        <div className="bg-white p-8 rounded-[24px] border-2 border-slate-100 shadow-sm">
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-2">Total Orders</p>
          <div className="text-4xl font-[900] text-[#2563EB]">{summary.totalOrders}</div>
        </div>
        <div className="bg-white p-8 rounded-[24px] border-2 border-slate-100 shadow-sm">
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-2">Avg / Order</p>
          <div className="text-4xl font-[900] text-[#F59E0B]">
            ₹{summary.totalOrders > 0 ? (summary.totalSales / summary.totalOrders).toFixed(0) : 0}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border-2 border-slate-100 shadow-sm">
          <h3 className="text-sm font-[900] text-slate-400 uppercase tracking-widest mb-6">Items Sold</h3>
          <div className="space-y-3">
            {Object.entries(summary.itemCounts).length > 0 ? (
              Object.entries(summary.itemCounts).sort((a, b) => (b[1] as number) - (a[1] as number)).map(([name, count]) => (
                <div key={name} className="flex items-center justify-between pb-3 border-b-2 border-slate-50 last:border-0">
                  <span className="font-bold text-slate-700">{name}</span>
                  <span className="bg-[#F1F5F9] px-3 py-1 rounded-lg font-[900] text-sm text-[#0F172A]">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 font-medium">No sales recorded today.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border-2 border-slate-100 shadow-sm">
          <h3 className="text-sm font-[900] text-slate-400 uppercase tracking-widest mb-6">Hourly Sales</h3>
          <div className="space-y-4">
            {Array.from({ length: 24 }).map((_, i) => {
              const sales = summary.hourlySales[i] || 0;
              if (sales === 0 && (i < 6 || i > 22)) return null;
              return (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-14 text-[10px] text-slate-400 font-[900]">{i}:00</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (sales / (summary.totalSales || 1)) * 300)}%` }}
                      className="h-full bg-[#10B981]"
                    />
                  </div>
                  <span className="w-16 text-right font-[900] text-[#0F172A] text-sm">₹{sales}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SettingsView({ onAdd }: { onAdd: () => void }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Item['category']>('Other');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const newItem: Item = {
      id: Math.random().toString(36).substring(7),
      name,
      price: Number(price),
      category,
      color: 'bg-slate-700', // Default color for custom items
    };

    storage.saveCustomItem(newItem);
    setName('');
    setPrice('');
    onAdd();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl space-y-8 pb-12"
    >
      <div>
        <h1 className="text-3xl font-[900] tracking-tighter text-[#0F172A]">SETTINGS</h1>
        <p className="text-slate-500 font-medium uppercase text-xs tracking-widest">Manage items and preferences</p>
      </div>

      <div className="bg-white p-10 rounded-[32px] border-2 border-slate-100 shadow-sm">
        <h3 className="text-sm font-[900] text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
          <Plus className="text-[#2563EB]" />
          Add New Item
        </h3>
        <form onSubmit={handleAddItem} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] pl-1">Item Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. SPECIAL COFFEE"
              className="w-full bg-[#F8FAFC] border-2 border-slate-50 rounded-2xl p-5 focus:ring-4 focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all font-bold placeholder:text-slate-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] pl-1">Price (₹)</label>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="w-full bg-[#F8FAFC] border-2 border-slate-50 rounded-2xl p-5 focus:ring-4 focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all font-bold placeholder:text-slate-300"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] pl-1">Category</label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#F8FAFC] border-2 border-slate-50 rounded-2xl p-5 focus:ring-4 focus:ring-blue-100 focus:border-[#2563EB] outline-none transition-all font-bold appearance-none"
                >
                  <option value="Tea">Tea</option>
                  <option value="Cigarettes">Cigarettes</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Biscuits">Biscuits</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-[#2563EB] text-white font-[900] py-5 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-600 active:scale-98 transition-all flex items-center justify-center gap-2 tracking-widest text-sm"
          >
            SAVE NEW ITEM
          </button>
        </form>
      </div>

      <div className="bg-[#FEF2F2] p-8 rounded-[32px] border-2 border-rose-100 text-rose-800">
        <h4 className="font-[900] mb-2 flex items-center gap-2 uppercase tracking-widest text-sm">
          <Trash size={18} />
          Danger Zone
        </h4>
        <p className="text-xs mb-6 text-rose-700/70 font-medium">Deleting all data will wipe daily sales, custom items and preferences permanently.</p>
        <button 
          onClick={() => {
            if(confirm('Are you sure? This will delete ALL orders and custom items.')) {
              storage.clearAllData();
              window.location.reload();
            }
          }}
          className="text-white bg-rose-600 px-8 py-3 rounded-xl font-[900] text-xs tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
        >
          RESET ALL DATA
        </button>
      </div>
    </motion.div>
  );
}
