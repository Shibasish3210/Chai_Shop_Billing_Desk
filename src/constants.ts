/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Item } from './types';

export const DEFAULT_ITEMS: Item[] = [
  // Tea
  { id: 'tea-5', name: 'Cup Tea ₹5', price: 5, category: 'Tea', color: 'bg-emerald-500' },
  { id: 'tea-10', name: 'Cup Tea ₹10', price: 10, category: 'Tea', color: 'bg-emerald-500' },
  { id: 'vaanr-6', name: 'Vaanr Tea ₹6', price: 6, category: 'Tea', color: 'bg-emerald-500' },
  { id: 'vaanr-10', name: 'Vaanr Tea ₹10', price: 10, category: 'Tea', color: 'bg-emerald-500' },

  // Cigarettes
  { id: 'flake-s', name: 'Flake Single', price: 8, category: 'Cigarettes', color: 'bg-indigo-500' },
  { id: 'flake-p', name: 'Flake Packet', price: 80, category: 'Cigarettes', color: 'bg-indigo-500' },
  { id: 'ss-s', name: 'Superstar Single', price: 7, category: 'Cigarettes', color: 'bg-indigo-500' },
  { id: 'ss-p', name: 'Superstar Packet', price: 70, category: 'Cigarettes', color: 'bg-indigo-500' },
  { id: 'gf-s', name: 'GoldFlake Single', price: 12, category: 'Cigarettes', color: 'bg-indigo-500' },
  { id: 'gf-p', name: 'GoldFlake Packet', price: 120, category: 'Cigarettes', color: 'bg-indigo-500' },

  // Snacks
  { id: 'pan', name: 'Pan Masala', price: 5, category: 'Snacks', color: 'bg-amber-500' },
  { id: 'chips', name: 'Chips', price: 5, category: 'Snacks', color: 'bg-amber-500' },
  { id: 'cake', name: 'Cake', price: 7, category: 'Snacks', color: 'bg-amber-500' },
  { id: 'bread', name: 'Bread', price: 6, category: 'Snacks', color: 'bg-amber-500' },
  { id: 'egg-toast', name: 'Egg Toast', price: 20, category: 'Snacks', color: 'bg-amber-500' },
  { id: 'beguni', name: 'Beguni', price: 5, category: 'Snacks', color: 'bg-amber-500' },
  { id: 'peyaji', name: 'Peyaji', price: 5, category: 'Snacks', color: 'bg-amber-500' },

  // Biscuits
  { id: 'bisc-s', name: 'Small Biscuit', price: 3, category: 'Biscuits', color: 'bg-pink-500', isSpecialCombo: true },
  { id: 'bisc-l', name: 'Large Biscuit', price: 5, category: 'Biscuits', color: 'bg-pink-500' },
];

export const CATEGORY_COLORS: Record<string, string> = {
  Tea: 'bg-emerald-500 text-white',
  Cigarettes: 'bg-indigo-500 text-white',
  Snacks: 'bg-amber-500 text-white',
  Biscuits: 'bg-pink-500 text-white',
  Other: 'bg-slate-500 text-white',
};
