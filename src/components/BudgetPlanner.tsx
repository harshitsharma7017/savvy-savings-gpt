
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Budget, Transaction } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { useBudgets } from "@/hooks/useBudgets";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Trash2 } from "lucide-react";

interface BudgetPlannerProps {
  budgets: Budget[];
  transactions: Transaction[];
  onAddBudget: (budget: Omit<Budget, 'id'>) => void;
}

const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Other"
];

const BudgetPlanner = ({ budgets, transactions, onAddBudget }: BudgetPlannerProps) => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { deleteBudget } = useBudgets();
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();

  const calculateSpentAmount = (budget: Budget) => {
    const now = new Date();
    let startDate: Date;
    
    // Calculate the start date based on budget period
    switch (budget.period) {
      case 'weekly':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'monthly':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    // Filter transactions for this category and period
    const categoryTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.type === 'expense' &&
        transaction.category === budget.category &&
        transactionDate >= startDate &&
        transactionDate <= now
      );
    });

    // Sum up the amounts
    return categoryTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !limit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onAddBudget({
        category,
        limit: parseFloat(limit),
        period
      });

      // Reset form on successful submission
      setCategory('');
      setLimit('');
      setPeriod('monthly');
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      await deleteBudget(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Budget</CardTitle>
          <CardDescription>Set spending limits for different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limit">Budget Limit *</Label>
                <Input
                  id="limit"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select value={period} onValueChange={(value) => setPeriod(value as 'monthly' | 'weekly' | 'yearly')} disabled={isSubmitting}>
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Budget...' : 'Create Budget'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget) => {
          const spentAmount = calculateSpentAmount(budget);
          const remainingAmount = budget.limit - spentAmount;
          const progressPercentage = Math.min((spentAmount / budget.limit) * 100, 100);
          const isOverBudget = spentAmount > budget.limit;

          return (
            <Card key={budget.id} className={`${isOverBudget ? 'border-red-200 bg-red-50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{budget.category}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteBudget(budget.id)}
                    className="hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="capitalize">{budget.period} Budget</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isOverBudget ? 'text-red-600 font-medium' : ''}>
                      Spent: {formatCurrency(spentAmount)}
                    </span>
                    <span>Limit: {formatCurrency(budget.limit)}</span>
                  </div>
                  <Progress 
                    value={progressPercentage} 
                    className={`w-full ${isOverBudget ? 'bg-red-100' : ''}`}
                  />
                  <p className={`text-xs ${
                    isOverBudget 
                      ? 'text-red-600 font-medium' 
                      : remainingAmount < budget.limit * 0.1 
                        ? 'text-orange-600 font-medium' 
                        : 'text-muted-foreground'
                  }`}>
                    {isOverBudget 
                      ? `Over budget by ${formatCurrency(Math.abs(remainingAmount))}` 
                      : `${formatCurrency(remainingAmount)} remaining`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <p>No budgets created yet.</p>
              <p className="text-sm">Create your first budget above to start tracking your spending limits.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetPlanner;
