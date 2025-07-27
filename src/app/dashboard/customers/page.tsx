import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchCustomers } from '@/lib/data';
import { CustomersTable } from '@/components/dashboard/customers-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function CustomersPage() {
  const customers = await fetchCustomers();

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Customers</h1>
        <div className="ml-auto flex items-center gap-2">
           <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        New Customer
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                    Enter the details of the new customer.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                    Name
                    </Label>
                    <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                    Email
                    </Label>
                    <Input id="email" type="email" className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                    Address
                    </Label>
                    <Input id="address" className="col-span-3" />
                </div>
                </div>
                <DialogFooter>
                <Button type="submit">Save Customer</Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Customers</CardTitle>
          <CardDescription>
            A list of all your customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomersTable customers={customers} />
        </CardContent>
      </Card>
    </>
  );
}
