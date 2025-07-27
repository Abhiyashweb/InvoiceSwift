'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, PlusCircle, Trash2, Sparkles, Loader2, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Customer, Product, Invoice } from '@/lib/definitions';
import { createInvoice } from '@/lib/data';
import { suggestInvoiceItems } from '@/ai/flows/suggest-invoice-items';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

const lineItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().min(0.01, 'Price must be positive'),
});

const invoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  issueDate: z.date({ required_error: 'Issue date is required' }),
  dueDate: z.date({ required_error: 'Due date is required' }),
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required'),
  tax: z.coerce.number().min(0).max(100),
  discount: z.coerce.number().min(0).max(100),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

const newCustomerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Address is required"),
});

type NewCustomerFormData = z.infer<typeof newCustomerSchema>;


export function InvoiceForm({
  customers: initialCustomers,
  products,
  pastInvoices
}: {
  customers: Customer[];
  products: Product[];
  pastInvoices: Invoice[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerId: '',
      issueDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
      tax: 8,
      discount: 0,
    },
  });

  const newCustomerForm = useForm<NewCustomerFormData>({
    resolver: zodResolver(newCustomerSchema),
    defaultValues: { name: "", email: "", address: "" }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  const watchLineItems = form.watch('lineItems');
  const watchTax = form.watch('tax');
  const watchDiscount = form.watch('discount');
  
  const subtotal = watchLineItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.unitPrice || 0), 0);
  const taxAmount = subtotal * (watchTax / 100);
  const discountAmount = subtotal * (watchDiscount / 100);
  const total = subtotal + taxAmount - discountAmount;

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    const selectedCustomer = customers.find(c => c.id === data.customerId);
    if (!selectedCustomer) {
      toast({ title: 'Error', description: 'Invalid customer selected.', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }
    
    const newInvoiceData = {
      // ... map form data to Invoice type
    };
    
    // Mock submission
    console.log("Submitting:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Success!',
      description: 'Invoice has been created successfully.',
    });
    router.push('/dashboard');
    setIsSubmitting(false);
  };

  const onNewCustomerSubmit = (data: NewCustomerFormData) => {
    const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        ...data
    };
    setCustomers(prev => [...prev, newCustomer]);
    form.setValue('customerId', newCustomer.id);
    setIsNewCustomerDialogOpen(false);
    newCustomerForm.reset();
     toast({
      title: 'Customer Created',
      description: `${newCustomer.name} has been added to the customer list.`,
    });
  }
  
  const handleProductSelect = (value: string, index: number) => {
    const product = products.find(p => p.name === value);
    if (product) {
        form.setValue(`lineItems.${index}.description`, product.name);
        form.setValue(`lineItems.${index}.unitPrice`, product.price);
    }
  }

  const handleSuggestion = async () => {
    setIsAiLoading(true);
    setAiSuggestions([]);
    const customerId = form.getValues('customerId');
    const customer = customers.find(c => c.id === customerId);

    if (!customer) {
        toast({ title: "Select a customer", description: "Please select a customer before getting suggestions.", variant: "destructive" });
        setIsAiLoading(false);
        return;
    }

    try {
        const pastInvoiceData = JSON.stringify(pastInvoices.filter(inv => inv.customer.id === customerId), null, 2);
        const newInvoiceContext = `New invoice for customer: ${customer.name}. Today's date is ${new Date().toLocaleDateString()}.`;

        const result = await suggestInvoiceItems({ pastInvoiceData, newInvoiceContext });
        setAiSuggestions(result.suggestedItems);
    } catch (error) {
        console.error("AI suggestion error:", error);
        toast({ title: "AI Error", description: "Could not fetch suggestions.", variant: "destructive" });
    } finally {
        setIsAiLoading(false);
    }
  };

  const addSuggestionToInvoice = (suggestion: string) => {
    const product = products.find(p => p.name === suggestion);
    if(product){
        append({ description: product.name, quantity: 1, unitPrice: product.price });
    } else {
        append({ description: suggestion, quantity: 1, unitPrice: 0 });
    }
    setAiSuggestions(prev => prev.filter(s => s !== suggestion));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className='md:col-span-2 grid gap-2'>
                    <Label htmlFor="customer">Customer</Label>
                    <div className="flex gap-2">
                        <Controller
                            control={form.control}
                            name="customerId"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
                            <DialogTrigger asChild>
                                <Button type="button" variant="outline">New Customer</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Customer</DialogTitle>
                                    <DialogDescription>Enter the details of the new customer.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={newCustomerForm.handleSubmit(onNewCustomerSubmit)} className="grid gap-4 py-4">
                                     <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" {...newCustomerForm.register('name')} />
                                        {newCustomerForm.formState.errors.name && <p className="text-sm text-destructive">{newCustomerForm.formState.errors.name.message}</p>}
                                     </div>
                                     <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" {...newCustomerForm.register('email')} />
                                         {newCustomerForm.formState.errors.email && <p className="text-sm text-destructive">{newCustomerForm.formState.errors.email.message}</p>}
                                     </div>
                                     <div className="grid gap-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input id="address" {...newCustomerForm.register('address')} />
                                         {newCustomerForm.formState.errors.address && <p className="text-sm text-destructive">{newCustomerForm.formState.errors.address.message}</p>}
                                     </div>
                                      <DialogFooter>
                                        <Button type="submit">Save Customer</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    {form.formState.errors.customerId && <p className="text-sm text-destructive">{form.formState.errors.customerId.message}</p>}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label>Issue Date</Label>
                    <Controller
                        control={form.control}
                        name="issueDate"
                        render={({ field }) => (
                            <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                            </Popover>
                        )}
                    />
                 </div>
                 <div className="grid gap-2">
                    <Label>Due Date</Label>
                    <Controller
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                            </Popover>
                        )}
                    />
                 </div>
              </div>

              <div>
                <Label>Line Items</Label>
                <div className="grid gap-4 mt-2">
                  {fields.map((field, index) => {
                    const quantity = watchLineItems[index]?.quantity || 0;
                    const unitPrice = watchLineItems[index]?.unitPrice || 0;
                    const itemTotal = quantity * unitPrice;
                    return (
                      <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                           <div className="col-span-12 md:col-span-5">
                              <Controller
                                  control={form.control}
                                  name={`lineItems.${index}.description`}
                                  render={({ field }) => (
                                      <Select onValueChange={(value) => handleProductSelect(value, index)} defaultValue={field.value}>
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select item or describe" />
                                          </SelectTrigger>
                                          <SelectContent>
                                              {products.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                                          </SelectContent>
                                      </Select>
                                  )}
                              />
                           </div>
                           <div className="col-span-3 md:col-span-2">
                              <Input type="number" placeholder="Qty" {...form.register(`lineItems.${index}.quantity`)} />
                           </div>
                           <div className="col-span-4 md:col-span-2">
                              <Input type="number" placeholder="Price" {...form.register(`lineItems.${index}.unitPrice`)} step="0.01" />
                           </div>
                           <div className="col-span-3 md:col-span-2 flex items-center justify-end">
                              <span className="text-sm font-medium w-20 text-right">
                                  ${itemTotal.toFixed(2)}
                              </span>
                           </div>
                          <div className="col-span-2 md:col-span-1 flex justify-end">
                              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                          </div>
                      </div>
                    )
                  })}
                </div>
                 <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                 </Button>
                  {form.formState.errors.lineItems && <p className="text-sm text-destructive mt-2">{form.formState.errors.lineItems.message}</p>}
              </div>

            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-8">
            <Card>
                <CardHeader className='flex-row items-center justify-between'>
                    <CardTitle>AI Suggestions</CardTitle>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={handleSuggestion}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Suggest Items
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle>Suggested Items</DialogTitle>
                                <DialogDescription>
                                    AI-powered suggestions based on the customer's history. Click to add to invoice.
                                </DialogDescription>
                             </DialogHeader>
                            {isAiLoading && <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                            {!isAiLoading && aiSuggestions.length === 0 && <p className='text-sm text-muted-foreground p-8 text-center'>No suggestions available. Try generating.</p>}
                            {!isAiLoading && aiSuggestions.length > 0 && (
                                <ul className='space-y-2 max-h-64 overflow-y-auto'>
                                    {aiSuggestions.map(s => (
                                        <li key={s} onClick={() => addSuggestionToInvoice(s)} className="flex justify-between items-center p-2 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer">
                                            <span>{s}</span>
                                            <PlusCircle className="h-4 w-4" />
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <DialogFooter>
                                <Button variant="ghost" onClick={handleSuggestion} disabled={isAiLoading}>
                                    {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Regenerate
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground'>Select a customer and click "Suggest Items" to get AI-powered recommendations based on past invoices.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                   <div className="flex justify-between">
                       <span>Subtotal</span>
                       <span>${subtotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center">
                       <Label htmlFor="tax" className="flex-shrink-0">Tax (%)</Label>
                       <Input id="tax" type="number" className="w-24" {...form.register('tax')} />
                   </div>
                    <div className="flex justify-between items-center">
                       <Label htmlFor="discount" className="flex-shrink-0">Discount (%)</Label>
                       <Input id="discount" type="number" className="w-24" {...form.register('discount')} />
                   </div>
                   <div className="border-t pt-4 flex justify-between font-bold text-lg">
                       <span>Total</span>
                       <span>${total.toFixed(2)}</span>
                   </div>
                </CardContent>
                <CardFooter>
                     <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Create Invoice
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </form>
  );
}
