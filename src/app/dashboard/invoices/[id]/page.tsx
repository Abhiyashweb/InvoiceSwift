'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchInvoiceById } from '@/lib/data';
import type { Invoice } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';

function InvoiceSkeleton() {
    return (
        <Card className="w-full max-w-4xl mx-auto printable-area">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-12 w-12" />
                </div>
                <Separator className="my-4" />
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><Skeleton className="h-4 w-24 mb-1" /><Skeleton className="h-4 w-32" /></div>
                    <div><Skeleton className="h-4 w-24 mb-1" /><Skeleton className="h-4 w-32" /></div>
                    <div><Skeleton className="h-4 w-24 mb-1" /><Skeleton className="h-4 w-32" /></div>
                    <div><Skeleton className="h-4 w-24 mb-1" /><Skeleton className="h-4 w-32" /></div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Skeleton className="h-4 w-full" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-full" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-full" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-full" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 <div className="mt-4 flex justify-end">
                    <div className="w-full max-w-xs space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                 </div>
            </CardContent>
        </Card>
    );
}

export default function InvoicePage({ params }: { params: { id: string } }) {
  const [invoice, setInvoice] = useState<Invoice | null | undefined>(null);
  const { id } = params;

  useEffect(() => {
    async function getInvoice() {
      const data = await fetchInvoiceById(id);
      setInvoice(data);
    }
    getInvoice();
  }, [id]);

  if (invoice === null) {
    return <InvoiceSkeleton />;
  }

  if (invoice === undefined) {
    notFound();
  }

  return (
    <div className="p-4">
        <div className="flex justify-end mb-4 no-print">
            <Button onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" /> Print / Download PDF
            </Button>
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
