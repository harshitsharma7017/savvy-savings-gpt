
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionForm from "@/components/TransactionForm";
import BudgetPlanner from "@/components/BudgetPlanner";
import Dashboard from "@/components/Dashboard";
import AIAssistant from "@/components/AIAssistant";
import { Transaction, Budget } from "@/types/finance";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString()
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Personal Finance Tracker</h1>
          <p className="text-muted-foreground">Manage your finances with AI-powered insights</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard transactions={transactions} budgets={budgets} />
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Add Transaction</CardTitle>
                <CardDescription>Record your income and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionForm onAddTransaction={addTransaction} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget">
            <BudgetPlanner budgets={budgets} onAddBudget={addBudget} />
          </TabsContent>

          <TabsContent value="ai-assistant">
            <AIAssistant transactions={transactions} budgets={budgets} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
