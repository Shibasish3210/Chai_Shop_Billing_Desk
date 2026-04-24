/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Item } from './types';

export const DEFAULT_ITEMS: Item[] = [
  // Tea
  { id: 'tea-5', name: 'Cup Tea ₹5', price: 5, category: 'Tea', color: 'bg-emerald-100 text-emerald-900', iconName: 'Coffee' },
  { id: 'tea-10', name: 'Cup Tea ₹10', price: 10, category: 'Tea', color: 'bg-emerald-100 text-emerald-900', iconName: 'Coffee' },
  { id: 'vaanr-6', name: 'Vaanr Tea ₹6', price: 6, category: 'Tea', color: 'bg-emerald-100 text-emerald-900', iconName: 'Coffee' },
  { id: 'vaanr-10', name: 'Vaanr Tea ₹10', price: 10, category: 'Tea', color: 'bg-emerald-100 text-emerald-900', iconName: 'Coffee' },

  // Cigarettes
  { id: 'flake-s', name: 'Flake Single', price: 8, category: 'Cigarettes', color: 'bg-indigo-100 text-indigo-900', iconName: 'Zap' },
  { id: 'flake-p', name: 'Flake Packet', price: 80, category: 'Cigarettes', color: 'bg-indigo-100 text-indigo-900', iconName: 'Box' },
  { id: 'ss-s', name: 'Superstar Single', price: 7, category: 'Cigarettes', color: 'bg-indigo-100 text-indigo-900', iconName: 'Zap' },
  { id: 'ss-p', name: 'Superstar Packet', price: 70, category: 'Cigarettes', color: 'bg-indigo-100 text-indigo-900', iconName: 'Box' },
  { id: 'gf-s', name: 'GoldFlake Single', price: 12, category: 'Cigarettes', color: 'bg-indigo-100 text-indigo-900', iconName: 'Zap' },
  { id: 'gf-p', name: 'GoldFlake Packet', price: 120, category: 'Cigarettes', color: 'bg-indigo-100 text-indigo-900', iconName: 'Box' },

  // Snacks
  { id: 'pan', name: 'Pan Masala', price: 5, category: 'Snacks', color: 'bg-orange-100 text-orange-900', iconName: 'Wind' },
  { id: 'chips', name: 'Chips', price: 5, category: 'Snacks', color: 'bg-orange-100 text-orange-900', iconName: 'Container' },
  { id: 'cake', name: 'Cake', price: 7, category: 'Snacks', color: 'bg-orange-100 text-orange-900', iconName: 'Cake' },
  { id: 'bread', name: 'Bread', price: 6, category: 'Snacks', color: 'bg-orange-100 text-orange-900', iconName: 'Wheat' },
  { id: 'egg-toast', name: 'Egg Toast', price: 20, category: 'Snacks', color: 'bg-orange-100 text-orange-900', iconName: 'Utensils' },
  { id: 'beguni', name: 'Beguni', price: 5, category: 'Snacks', color: 'bg-orange-100 text-orange-900', iconName: 'Flame' },
  { id: 'peyaji', name: 'Peyaji', price: 5, category: 'Snacks', color: 'bg-orange-100 text-orange-900', iconName: 'Flame' },

  // Biscuits
  { id: 'bisc-s', name: 'Small Biscuit', price: 3, category: 'Biscuits', color: 'bg-pink-100 text-pink-900', isSpecialCombo: true, iconName: 'Cookie' },
  { id: 'bisc-l', name: 'Large Biscuit', price: 5, category: 'Biscuits', color: 'bg-pink-100 text-pink-900', iconName: 'Cookie' },
];

export const CATEGORY_COLORS: Record<string, string> = {
  Tea: 'bg-emerald-600 text-white',
  Cigarettes: 'bg-indigo-600 text-white',
  Snacks: 'bg-orange-600 text-white',
  Biscuits: 'bg-pink-600 text-white',
  Other: 'bg-slate-600 text-white',
};
