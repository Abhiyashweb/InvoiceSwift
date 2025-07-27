import { notFound } from 'next/navigation';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchInvoiceById } from '@/lib/data';
import { Icons } from '@/components/icons';
import { InvoicePrintButton } from '@/components/dashboard/invoice-print-button';

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const invoice = await fetchInvoiceById(params.id);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="p-4">
        <div className="flex justify-end mb-4 no-print">
            <InvoicePrintButton />
        </div>
      <Card className="w-full max-w-4xl mx-auto shadow-lg printable-area">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-primary">INVOICE</h1>
              <p className="text-muted-foreground"># {invoice.invoiceNumber}</p>
            </div>
             <div className="flex items-center gap-2 text-primary">
                <Icons.logo className="h-10 w-10"/>
                <span className="font-bold text-xl">InvoiceSwift</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
                <p className="font-semibold text-muted-foreground">Billed To</p>
                <p>{invoice.customer.name}</p>
                <p>{invoice.customer.email}</p>
                <p>{invoice.customer.address}</p>
            </div>
             <div>
                <p className="font-semibold text-muted-foreground">From</p>
                <p>InvoiceSwift Inc.</p>
                <p>contact@invoiceswift.com</p>
                <p>123 App Avenue, Tech City</p>
            </div>
            <div>
                <p className="font-semibold text-muted-foreground">Issue Date</p>
                <p>{new Date(invoice.issueDate).toLocaleDateString()}</p>
            </div>
            <div>
                <p className="font-semibold text-muted-foreground">Due Date</p>
                <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lineItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Separator className="my-4" />
           <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax ({invoice.tax}%)</span>
                        <span>${(invoice.subtotal * (invoice.tax / 100)).toFixed(2)}</span>
                    </div>
                    {invoice.discount > 0 && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Discount ({invoice.discount}%)</span>
                            <span>-${(invoice.subtotal * (invoice.discount / 100)).toFixed(2)}</span>
                        </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span>${invoice.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
            <p>Thank you for your business! Please pay within 30 days.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
