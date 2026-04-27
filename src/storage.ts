/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order, DailySummary, Item } from './types';

const ORDERS_KEY = 'chai_bill_orders';
const ITEMS_KEY = 'chai_bill_items';

const RECENT_BILLS_KEY = 'chai_draft_bills';
const ACTIVE_BILL_KEY = 'chai_active_bill_id';
const PRICE_OVERRIDES_KEY = 'chai_price_overrides';

export const storage = {
  getOrders(): Order[] {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveOrder(order: Order) {
    const orders = this.getOrders();
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },

  getCustomItems(): Item[] {
    const data = localStorage.getItem(ITEMS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveCustomItem(item: Item) {
    const items = this.getCustomItems();
    items.push(item);
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  },

  getDailySummary(date: string): DailySummary {
    const orders = this.getOrders().filter(o => o.date === date);
    
    const summary: DailySummary = {
      date,
      totalSales: 0,
      totalOrders: orders.length,
      itemCounts: {},
      hourlySales: {},
    };

    orders.forEach(order => {
      summary.totalSales += order.total;
      
      // Hourly grouping
      const hour = new Date(order.timestamp).getHours();
      summary.hourlySales[hour] = (summary.hourlySales[hour] || 0) + order.total;

      // Item grouping
      order.items.forEach(item => {
        summary.itemCounts[item.name] = (summary.itemCounts[item.name] || 0) + item.quantity;
      });
    });

    return summary;
  },

  clearOrders() {
    localStorage.removeItem(ORDERS_KEY);
  },

  clearCustomItems() {
    localStorage.removeItem(ITEMS_KEY);
  },

  updateCustomItemPrice(id: string, newPrice: number) {
    const items = this.getCustomItems();
    const updated = items.map(item => item.id === id ? { ...item, price: newPrice } : item);
    localStorage.setItem(ITEMS_KEY, JSON.stringify(updated));
  },

  getPriceOverrides(): Record<string, number> {
    const data = localStorage.getItem(PRICE_OVERRIDES_KEY);
    return data ? JSON.parse(data) : {};
  },

  savePriceOverride(itemId: string, price: number) {
    const overrides = this.getPriceOverrides();
    overrides[itemId] = price;
    localStorage.setItem(PRICE_OVERRIDES_KEY, JSON.stringify(overrides));
  },

  clearAllData() {
    localStorage.removeItem(ORDERS_KEY);
    localStorage.removeItem(ITEMS_KEY);
    localStorage.removeItem(PRICE_OVERRIDES_KEY);
    localStorage.removeItem(RECENT_BILLS_KEY);
    localStorage.removeItem(ACTIVE_BILL_KEY);
  }
};

export const calculateItemTotal = (item: { id: string; price: number; quantity: number; isSpecialCombo?: boolean }): number => {
  if (item.isSpecialCombo && item.id === 'bisc-s') {
    // 1 = ₹3, 2 = ₹5
    const pairs = Math.floor(item.quantity / 2);
    const remainder = item.quantity % 2;
    return (pairs * 5) + (remainder * 3);
  }
  return item.price * item.quantity;
};
