
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Budget } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface BudgetPlannerProps {
  budgets: Budget[];
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

const BudgetPlanner = ({ budgets, onAddBudget }: BudgetPlannerProps) => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !limit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const existingBudget = budgets.find(b => b.category === category && b.period === period);
    if (existingBudget) {
      toast({
        title: "Error",
        description: "Budget for this category and period already exists",
        variant: "destructive",
      });
      return;
    }

    onAddBudget({
      category,
      limit: parseFloat(limit),
      period
    });

    // Reset form
    setCategory('');
    setLimit('');
    setPeriod('monthly');

    toast({
      title: "Success",
      description: "Budget created successfully!",
    });
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
                <Select value={category} onValueChange={setCategory}>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select value={period} onValueChange={(value) => setPeriod(value as 'monthly' | 'weekly' | 'yearly')}>
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

            <Button type="submit" className="w-full">
              Create Budget
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget) => (
          <Card key={budget.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{budget.category}</CardTitle>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="capitalize">{budget.period} Budget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Spent: $0.00</span>
                  <span>Limit: ${budget.limit.toFixed(2)}</span>
                </div>
                <Progress value={0} className="w-full" />
                <p className="text-xs text-muted-foreground">
                  ${budget.limit.toFixed(2)} remaining
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
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
