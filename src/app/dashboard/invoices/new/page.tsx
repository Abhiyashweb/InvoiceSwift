import { InvoiceForm } from '@/components/dashboard/invoice-form';
import { fetchCustomers, fetchProducts, fetchInvoices } from '@/lib/data';

export default async function NewInvoicePage() {
    const [customers, products, pastInvoices] = await Promise.all([
        fetchCustomers(),
        fetchProducts(),
        fetchInvoices()
    ]);
  
  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Create New Invoice</h1>
      </div>
      <InvoiceForm customers={customers} products={products} pastInvoices={pastInvoices} />
    </>
  );
}
