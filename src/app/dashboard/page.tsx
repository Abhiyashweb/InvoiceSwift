import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchInvoices } from '@/lib/data';
import { InvoicesTable } from '@/components/dashboard/invoices-table';

export default async function DashboardPage() {
  const invoices = await fetchInvoices();
  
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Invoices</h1>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/dashboard/invoices/new">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                New Invoice
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            A list of your most recent invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoicesTable invoices={invoices} />
        </CardContent>
      </Card>
    </>
  );
}
