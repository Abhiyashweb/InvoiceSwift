import type { Customer, Product, Invoice, LineItem } from './definitions';

export const customers: Customer[] = [
  { id: '1', name: 'Innovate LLC', email: 'contact@innovate.com', address: '123 Tech Park, Silicon Valley, CA' },
  { id: '2', name: 'Solutions Co.', email: 'support@solutions.co', address: '456 Business Ave, New York, NY' },
  { id: '3', name: 'Creative Inc.', email: 'hello@creative.inc', address: '789 Design St, Los Angeles, CA' },
];

export const products: Product[] = [
  { id: 'prod-1', name: 'Web Design Package', description: 'Full website design and development', price: 2500 },
  { id: 'prod-2', name: 'Logo Design', description: 'Custom logo and branding guide', price: 800 },
  { id: 'prod-3', name: 'SEO Consultation', description: 'Monthly SEO and analytics report', price: 500 },
  { id: 'prod-4', name: 'Content Writing', description: '10 pages of web content', price: 1200 },
  { id: 'prod-5', name: 'Hosting Service', description: '1 year of premium web hosting', price: 240 },
];

const createLineItems = (items: { product: Product; quantity: number }[]): { lineItems: LineItem[], subtotal: number } => {
  const lineItems = items.map((item, index) => ({
    id: `li-${index + 1}`,
    description: item.product.name,
    quantity: item.quantity,
    unitPrice: item.product.price,
    total: item.quantity * item.product.price,
  }));
  const subtotal = lineItems.reduce((acc, item) => acc + item.total, 0);
  return { lineItems, subtotal };
};

const calculateTotal = (subtotal: number, tax: number, discount: number) => {
  const taxAmount = subtotal * (tax / 100);
  const discountAmount = subtotal * (discount / 100);
  return subtotal + taxAmount - discountAmount;
}

const invoice1Items = createLineItems([{ product: products[0], quantity: 1 }, { product: products[4], quantity: 1 }]);
const invoice2Items = createLineItems([{ product: products[1], quantity: 1 }, { product: products[2], quantity: 2 }]);
const invoice3Items = createLineItems([{ product: products[3], quantity: 1 }]);


export const invoices: Invoice[] = [
  { 
    id: 'inv-001', 
    invoiceNumber: '2024-001', 
    customer: customers[0], 
    issueDate: '2024-07-01', 
    dueDate: '2024-07-31', 
    lineItems: invoice1Items.lineItems,
    subtotal: invoice1Items.subtotal,
    tax: 8,
    discount: 0,
    total: calculateTotal(invoice1Items.subtotal, 8, 0),
    status: 'paid' 
  },
  { 
    id: 'inv-002', 
    invoiceNumber: '2024-002', 
    customer: customers[1], 
    issueDate: '2024-07-15', 
    dueDate: '2024-08-15', 
    lineItems: invoice2Items.lineItems,
    subtotal: invoice2Items.subtotal,
    tax: 5,
    discount: 10,
    total: calculateTotal(invoice2Items.subtotal, 5, 10),
    status: 'pending' 
  },
  { 
    id: 'inv-003', 
    invoiceNumber: '2024-003', 
    customer: customers[2], 
    issueDate: '2024-06-20', 
    dueDate: '2024-07-20', 
    lineItems: invoice3Items.lineItems,
    subtotal: invoice3Items.subtotal,
    tax: 10,
    discount: 0,
    total: calculateTotal(invoice3Items.subtotal, 10, 0),
    status: 'overdue' 
  },
];
