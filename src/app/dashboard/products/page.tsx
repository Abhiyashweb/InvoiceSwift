import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchProducts } from '@/lib/data';
import { ProductsTable } from '@/components/dashboard/products-table';
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
import { Textarea } from '@/components/ui/textarea';

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
        <div className="ml-auto flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        New Product
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                    Enter the details of the new product or service.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                    Name
                    </Label>
                    <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">
                    Description
                    </Label>
                    <Textarea id="description" className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                    Price
                    </Label>
                    <Input id="price" type="number" className="col-span-3" />
                </div>
                </div>
                <DialogFooter>
                <Button type="submit">Save Product</Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            A list of all your products and services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsTable products={products} />
        </CardContent>
      </Card>
    </>
  );
}
