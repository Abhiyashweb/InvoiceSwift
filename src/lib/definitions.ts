export type InvoiceStatus = 'paid' | 'pending' | 'draft' | 'overdue';

export interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: Customer;
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  subtotal: number;
  tax: number; // as a percentage
  discount: number; // as a percentage
  total: number;
  status: InvoiceStatus;
}
