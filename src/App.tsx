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
  LayoutGrid,
  Coffee,
  Zap,
  Box,
  Wind,
  Container,
  Cake,
  Wheat,
  Utensils,
  Flame,
  Cookie,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { DEFAULT_ITEMS, CATEGORY_COLORS } from './constants';
import { Item, CartItem, Order, DailySummary } from './types';
import { storage, calculateItemTotal } from './storage';

export default function App() {
  const [view, setView] = useState<'billing' | 'summary' | 'settings'>('billing');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customItems, setCustomItems] = useState<Item[]>([]);
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  // Load custom items on mount
  useEffect(() => {
    setCustomItems(storage.getCustomItems());
  }, []);

  const allItemsByGroup = useMemo(() => {
    const items = [...DEFAULT_ITEMS, ...customItems];
    return items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, Item[]>);
  }, [customItems]);

  const IconComponent = ({ name, size = 24 }: { name?: string; size?: number }) => {
    switch (name) {
      case 'Coffee': return <Coffee size={size} />;
      case 'Zap': return <Zap size={size} />;
      case 'Box': return <Box size={size} />;
      case 'Wind': return <Wind size={size} />;
      case 'Container': return <Container size={size} />;
      case 'Cake': return <Cake size={size} />;
      case 'Wheat': return <Wheat size={size} />;
      case 'Utensils': return <Utensils size={size} />;
      case 'Flame': return <Flame size={size} />;
      case 'Cookie': return <Cookie size={size} />;
      default: return <Plus size={size} />;
    }
  };

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
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans flex flex-col max-w-[1400px] mx-auto overflow-hidden h-screen">
      
      {/* Header - Fixed at Top */}
      <header className="bg-white border-b-2 border-slate-100 p-4 shrink-0 z-50">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-[900] tracking-tighter text-[#0F172A]">CHAI POINT</h1>
            <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setView('billing')} 
              className={`p-3 rounded-xl transition-all ${view === 'billing' ? 'bg-[#0F172A] text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}
            >
              <LayoutGrid size={22} />
            </button>
            <button 
              onClick={() => setView('summary')} 
              className={`p-3 rounded-xl transition-all ${view === 'summary' ? 'bg-[#0F172A] text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}
            >
              <History size={22} />
            </button>
            <button 
              onClick={() => setView('settings')} 
              className={`p-3 rounded-xl transition-all ${view === 'settings' ? 'bg-[#0F172A] text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}
            >
              <Plus size={22} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <AnimatePresence mode="wait">
            {view === 'billing' && (
              <motion.div 
                key="billing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 md:p-8 flex flex-col gap-6"
              >
                {/* Items Grouped by Category */}
                <div className="flex flex-col gap-10 pb-48 md:pb-12">
                  {(Object.entries(allItemsByGroup) as [string, Item[]][]).map(([category, items]) => (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-10 rounded-full ${CATEGORY_COLORS[category]?.split(' ')[0] || 'bg-slate-500'}`} />
                        <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[0.2em]">{category}</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => addToCart(item)}
                            className={`${item.color} min-h-[140px] md:min-h-[160px] p-6 rounded-[28px] shadow-xl shadow-slate-200/50 active:scale-95 active:opacity-70 transition-all flex flex-col items-center justify-between text-center relative overflow-hidden group border-2 border-slate-200/50 hover:border-slate-300`}
                          >
                            {/* Larger, decorative icon in background to prevent overlap */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] group-hover:scale-110 transition-transform pointer-events-none">
                              <IconComponent name={item.iconName} size={110} />
                            </div>
                            
                            <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
                               <span className="text-2xl md:text-3xl font-[1000] uppercase tracking-tighter leading-[1] mb-1 drop-shadow-sm break-words px-2">
                                {item.name.split(' ₹')[0]}
                              </span>
                            </div>
                            
                            <div className="bg-white/50 backdrop-blur-sm px-6 py-2.5 rounded-2xl w-full flex justify-between items-center relative z-10 border-t border-white/40">
                              <span className="text-[10px] font-black uppercase tracking-[0.1em] opacity-60">Price</span>
                              <span className="text-xl md:text-2xl font-black">₹{item.price}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {view === 'summary' && (
              <div className="p-4 md:p-8 overflow-y-auto h-full">
                <SummaryView />
              </div>
            )}
            
            {view === 'settings' && (
              <div className="p-4 md:p-8 overflow-y-auto h-full">
                <SettingsView onAdd={() => setCustomItems(storage.getCustomItems())} />
              </div>
            )}
          </AnimatePresence>
        </main>

        {/* Sidebar (Cart) - Desktop fixed / Mobile Overlay or Bottom Drawer */}
        <aside className={`
          fixed bottom-0 left-0 right-0 z-40 bg-white border-t-4 border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]
          md:relative md:w-[380px] md:border-t-0 md:border-l-4 md:shadow-none
          flex flex-col transition-all duration-300
          ${view !== 'billing' ? 'translate-y-full md:translate-y-0' : 'translate-y-0'}
          ${isCartExpanded ? 'h-[85%] md:h-full' : 'h-[72px] md:h-full'}
        `}>
          {/* Mobile Header / Expand Toggle */}
          <div 
            onClick={() => setIsCartExpanded(!isCartExpanded)}
            className="md:hidden flex items-center justify-between p-4 bg-[#0F172A] text-white cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-1.5 rounded-lg">
                <ShoppingCart size={20} />
              </div>
              <p className="font-black text-lg">Bill: {cart.length} Items</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black">₹{cartTotal}</span>
              {isCartExpanded ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
            </div>
          </div>

          <div className={`p-5 border-b-2 border-slate-100 flex justify-between items-center shrink-0 ${!isCartExpanded && 'hidden md:flex'}`}>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                <ShoppingCart size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-[900] tracking-tighter text-[#0F172A]">CURRENT BILL</h2>
            </div>
            {cart.length > 0 && (
              <button 
                onClick={undoLastItem}
                className="flex items-center gap-2 text-slate-400 font-black text-xs hover:text-rose-500 transition-colors uppercase tracking-widest"
              >
                <Trash2 size={18} />
                Undo
              </button>
            )}
          </div>

          <div className={`flex-1 overflow-y-auto p-5 space-y-4 ${!isCartExpanded && 'hidden md:block'}`}>
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4 py-8">
                <ShoppingCart size={64} strokeWidth={1} />
                <p className="font-black text-xs uppercase tracking-[0.2em]">Select items to bill</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between group bg-slate-50 p-4 rounded-2xl border-2 border-transparent hover:border-slate-100 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="bg-[#0F172A] text-white px-3 py-1.5 rounded-lg font-black text-lg min-w-[40px] text-center">{item.quantity}</span>
                    <div>
                      <p className="font-extrabold text-lg text-[#0F172A] leading-none mb-1">{item.name}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rate: ₹{item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-xl text-[#0F172A]">₹{calculateItemTotal(item)}</span>
                    <div className="hidden group-hover:flex gap-1">
                      <button onClick={() => removeFromCart(item.id)} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400"><Minus size={16}/></button>
                      <button onClick={() => addToCart(item)} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400"><Plus size={16}/></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={`p-6 mt-auto border-t-[6px] border-double border-slate-100 bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.05)] shrink-0 ${!isCartExpanded && 'hidden md:block'}`}>
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-black text-slate-400 uppercase tracking-widest">Total</span>
              <span className="text-5xl font-black text-[#0F172A] tracking-tighter">₹{cartTotal}</span>
            </div>
            <button
              disabled={cart.length === 0}
              onClick={handleCompleteOrder}
              className={`w-full py-6 md:py-8 rounded-[24px] font-black text-2xl transition-all shadow-2xl relative overflow-hidden ${
                cart.length > 0 
                  ? 'bg-[#2563EB] text-white shadow-blue-200 active:scale-95' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              COMPLETE ORDER
            </button>
          </div>
        </aside>
      </div>

      {/* Hidden Stats Bar on Mobile, Sticky Footer on Wide Screens */}
      {view === 'billing' && (
        <div className="hidden lg:flex bg-[#0F172A] text-white p-4 px-10 border-t border-slate-800 justify-between items-center z-50">
          <DailyStats />
        </div>
      )}

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
