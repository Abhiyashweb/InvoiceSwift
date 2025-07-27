'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Users, Package, Settings, LifeBuoy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '../icons';

const navItems = [
  { href: '/dashboard', label: 'Invoices', icon: FileText },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/products', label: 'Products', icon: Package },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="">InvoiceSwift</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4 gap-2">
          {navItems.map(({ href, label, icon: Icon }) => {
             const isActive = (href === '/dashboard' && pathname === href) || (href !== '/dashboard' && pathname.startsWith(href));
            return (
                <Link key={href} href={href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Button>
                </Link>
            )
          })}
        </nav>
      </div>
       <div className="mt-auto p-4">
           <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4 gap-2 border-t">
                 <Link href="#">
                  <Button
                    variant='ghost'
                    className="w-full justify-start"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
                 <Link href="#">
                  <Button
                    variant='ghost'
                    className="w-full justify-start"
                  >
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Help & Support
                  </Button>
                </Link>
            </nav>
        </div>
    </div>
  );
}
