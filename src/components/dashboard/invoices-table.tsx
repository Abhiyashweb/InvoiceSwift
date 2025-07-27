'use client';

import * as React from 'react';
import Link from 'next/link';
import { MoreHorizontal, Eye, Download } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Invoice, InvoiceStatus } from '@/lib/definitions';
import { Skeleton } from '../ui/skeleton';

const statusVariantMap: Record<
  InvoiceStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  paid: 'default',
  pending: 'secondary',
  overdue: 'destructive',
  draft: 'outline',
};

function InvoiceTableRow({ invoice }: { invoice: Invoice }) {
  const formattedDate = new Date(invoice.dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(invoice.total);

  return (
    <TableRow>
      <TableCell className="font-medium">
        <Link href={`/dashboard/invoices/${invoice.id}`} className="hover:underline">
            {invoice.invoiceNumber}
        </Link>
      </TableCell>
      <TableCell>{invoice.customer.name}</TableCell>
      <TableCell className="hidden md:table-cell">{formattedDate}</TableCell>
      <TableCell className="text-right">{formattedTotal}</TableCell>
      <TableCell>
        <Badge variant={statusVariantMap[invoice.status]} className="capitalize">
          {invoice.status}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
                <Link href={`/dashboard/invoices/${invoice.id}`} className='flex items-center cursor-pointer'>
                    <Eye className="mr-2 h-4 w-4" /> View
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.print()} className='flex items-center cursor-pointer'>
                <Download className="mr-2 h-4 w-4" /> Download PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                </TableRow>
            ))}
        </>
    )
}

export function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (invoices.length > 0) {
      setIsLoading(false);
    }
  }, [invoices]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="hidden md:table-cell">Due Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? <TableSkeleton /> : invoices.map((invoice) => (
          <InvoiceTableRow key={invoice.id} invoice={invoice} />
        ))}
      </TableBody>
    </Table>
  );
}
