/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order, DailySummary, Item } from './types';

const ORDERS_KEY = 'chai_bill_orders';
const ITEMS_KEY = 'chai_bill_items';

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

  clearAllData() {
    localStorage.removeItem(ORDERS_KEY);
    localStorage.removeItem(ITEMS_KEY);
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
