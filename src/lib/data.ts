'use server';

import { invoices, customers, products } from './placeholder-data';
import type { Invoice } from './definitions';

// Simulate a network delay
const FAKE_DELAY = 1000;

export async function fetchInvoices() {
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY / 2));
  return invoices;
}

export async function fetchInvoiceById(id: string) {
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY / 3));
  return invoices.find((invoice) => invoice.id === id);
}

export async function fetchCustomers() {
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY / 4));
  return customers;
}

export async function fetchProducts() {
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY / 4));
  return products;
}

export async function createInvoice(invoice: Invoice) {
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY));
  console.log('Creating new invoice:', invoice);
  // In a real app, you would add the invoice to the database
  // For now, we'll just log it and return success
  return { success: true, invoiceId: `inv-${Date.now()}` };
}
