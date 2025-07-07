
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Bell, Trash2, Plus } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useToast } from "@/hooks/use-toast";

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  frequency: 'monthly' | 'weekly' | 'yearly';
  category: string;
  isPaid: boolean;
}

const BillsManager = () => {
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBill, setNewBill] = useState({
    name: '',
    amount: '',
    dueDate: '',
    frequency: 'monthly' as const,
    category: 'utilities'
  });

  const categories = [
    'utilities', 'rent', 'insurance', 'subscriptions', 
    'loan', 'credit-card', 'internet', 'phone', 'other'
  ];

  const addBill = () => {
    if (!newBill.name || !newBill.amount || !newBill.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const bill: Bill = {
      id: Date.now().toString(),
      name: newBill.name,
      amount: parseFloat(newBill.amount),
      dueDate: newBill.dueDate,
      frequency: newBill.frequency,
      category: newBill.category,
      isPaid: false
    };

    setBills([...bills, bill]);
    setNewBill({ name: '', amount: '', dueDate: '', frequency: 'monthly', category: 'utilities' });
    setShowAddForm(false);
    
    toast({
      title: "Bill Added",
      description: `${bill.name} has been added to your bills`,
    });
  };

  const togglePaid = (id: string) => {
    setBills(bills.map(bill => 
      bill.id === id ? { ...bill, isPaid: !bill.isPaid } : bill
    ));
  };

  const deleteBill = (id: string) => {
    setBills(bills.filter(bill => bill.id !== id));
    toast({
      title: "Bill Deleted",
      description: "Bill has been removed from your list",
    });
  };

  const getUpcomingBills = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return bills.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      return dueDate <= nextWeek && !bill.isPaid;
    });
  };

  const overdueBills = bills.filter(bill => {
    const dueDate = new Date(bill.dueDate);
    const today = new Date();
    return dueDate < today && !bill.isPaid;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Bills Manager
          </h2>
          <p className="text-slate-600 mt-2">Keep track of your recurring bills and payments</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-gradient-to-r from-blue-500 to-indigo-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Bill
        </Button>
      </div>

      {/* Notifications */}
      {(overdueBills.length > 0 || getUpcomingBills().length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {overdueBills.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Overdue Bills ({overdueBills.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {overdueBills.map(bill => (
                  <div key={bill.id} className="flex justify-between items-center py-2">
                    <span className="font-medium">{bill.name}</span>
                    <span className="text-red-600">{formatCurrency(bill.amount)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {getUpcomingBills().length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-yellow-700 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Due This Week ({getUpcomingBills().length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getUpcomingBills().map(bill => (
                  <div key={bill.id} className="flex justify-between items-center py-2">
                    <span className="font-medium">{bill.name}</span>
                    <span className="text-yellow-600">{formatCurrency(bill.amount)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Add Bill Form */}
      {showAddForm && (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
            <CardTitle>Add New Bill</CardTitle>
            <CardDescription className="text-blue-100">
              Add a recurring bill to track your payments
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billName">Bill Name</Label>
                <Input
                  id="billName"
                  value={newBill.name}
                  onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
                  placeholder="e.g., Electric Bill"
                />
              </div>
              <div>
                <Label htmlFor="billAmount">Amount</Label>
                <Input
                  id="billAmount"
                  type="number"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={newBill.frequency} onValueChange={(val) => setNewBill({ ...newBill, frequency: val as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={newBill.category} onValueChange={(val) => setNewBill({ ...newBill, category: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={addBill} className="bg-gradient-to-r from-blue-500 to-indigo-500">
                Add Bill
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bills List */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Your Bills
          </CardTitle>
          <CardDescription>
            {bills.length === 0 ? "No bills added yet" : `${bills.length} bills tracked`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bills.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bills added yet. Click "Add Bill" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bills.map(bill => (
                <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-medium">{bill.name}</h4>
                      <p className="text-sm text-slate-600">
                        Due: {new Date(bill.dueDate).toLocaleDateString()} • {bill.frequency}
                      </p>
                    </div>
                    <Badge variant={bill.category === 'utilities' ? 'default' : 'secondary'}>
                      {bill.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">{formatCurrency(bill.amount)}</span>
                    <Button
                      size="sm"
                      variant={bill.isPaid ? "default" : "outline"}
                      onClick={() => togglePaid(bill.id)}
                    >
                      {bill.isPaid ? "Paid" : "Mark Paid"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteBill(bill.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillsManager;
