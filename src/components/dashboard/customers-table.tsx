'use client';

import * as React from 'react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
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
import type { Customer } from '@/lib/definitions';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

function getInitials(name: string) {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}


function CustomerTableRow({ customer }: { customer: Customer }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`https://placehold.co/40x40.png?text=${getInitials(customer.name)}`} />
            <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{customer.name}</div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
      <TableCell className="hidden lg:table-cell">{customer.address}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer"><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive cursor-pointer"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                </TableRow>
            ))}
        </>
    )
}

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (customers.length > 0) {
        setIsLoading(false);
    }
  }, [customers]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Email</TableHead>
          <TableHead className="hidden lg:table-cell">Address</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? <TableSkeleton /> : customers.map((customer) => (
          <CustomerTableRow key={customer.id} customer={customer} />
        ))}
      </TableBody>
    </Table>
  );
}
