
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  PiggyBank, 
  CreditCard, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ImportantFeaturesProps {
  transactions: any[];
  budgets: any[];
}

const ImportantFeatures = ({ transactions, budgets }: ImportantFeaturesProps) => {
  const { formatCurrency } = useCurrency();

  // Calculate financial health metrics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
  
  const budgetUtilization = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...budget,
      spent,
      percentage: budget.limit > 0 ? (spent / budget.limit * 100) : 0
    };
  });

  const avgBudgetUtilization = budgetUtilization.length > 0 
    ? budgetUtilization.reduce((sum, b) => sum + b.percentage, 0) / budgetUtilization.length 
    : 0;

  const features = [
    {
      title: "Financial Health Score",
      description: "Based on your spending patterns and savings rate",
      icon: TrendingUp,
      value: Math.max(0, Math.min(100, 70 + savingsRate - (avgBudgetUtilization - 80))),
      unit: "/100",
      color: "text-green-600",
      bgColor: "bg-green-50",
      action: "View Details"
    },
    {
      title: "Savings Rate",
      description: "Percentage of income saved this month",
      icon: PiggyBank,
      value: Math.max(0, savingsRate),
      unit: "%",
      color: savingsRate >= 20 ? "text-green-600" : savingsRate >= 10 ? "text-yellow-600" : "text-red-600",
      bgColor: savingsRate >= 20 ? "bg-green-50" : savingsRate >= 10 ? "bg-yellow-50" : "bg-red-50",
      action: "Improve"
    },
    {
      title: "Budget Performance",
      description: "Average budget utilization across categories",
      icon: Target,
      value: avgBudgetUtilization,
      unit: "%",
      color: avgBudgetUtilization <= 80 ? "text-green-600" : avgBudgetUtilization <= 90 ? "text-yellow-600" : "text-red-600",
      bgColor: avgBudgetUtilization <= 80 ? "bg-green-50" : avgBudgetUtilization <= 90 ? "bg-yellow-50" : "bg-red-50",
      action: "Adjust Budgets"
    },
    {
      title: "Monthly Cash Flow",
      description: "Net income after all expenses",
      icon: CreditCard,
      value: totalIncome - totalExpenses,
      unit: "",
      format: "currency",
      color: (totalIncome - totalExpenses) >= 0 ? "text-green-600" : "text-red-600",
      bgColor: (totalIncome - totalExpenses) >= 0 ? "bg-green-50" : "bg-red-50",
      action: "Optimize"
    }
  ];

  const quickActions = [
    {
      title: "Emergency Fund",
      description: "Build 3-6 months of expenses",
      icon: AlertCircle,
      target: totalExpenses * 3,
      current: Math.max(0, totalIncome - totalExpenses) * 6, // Simplified calculation
      color: "text-orange-600"
    },
    {
      title: "Debt Payoff",
      description: "Track your debt reduction progress",
      icon: CreditCard,
      target: 5000, // Example target
      current: 3200, // Example current debt
      color: "text-red-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
          Important Features
        </h2>
        <p className="text-slate-600 mt-2">Key financial insights and tools to help you succeed</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Card key={index} className={`border-0 shadow-lg ${feature.bgColor}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
                <Button variant="ghost" size="sm" className="opacity-70 hover:opacity-100">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-700">{feature.title}</h3>
                <div className={`text-2xl font-bold ${feature.color}`}>
                  {feature.format === 'currency' 
                    ? formatCurrency(feature.value)
                    : `${Math.round(feature.value)}${feature.unit}`
                  }
                </div>
                <p className="text-xs text-gray-600">{feature.description}</p>
                <Button variant="ghost" size="sm" className={`w-full text-xs ${feature.color}`}>
                  {feature.action}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Financial Goals */}
      <div className="grid gap-6 md:grid-cols-2">
        {quickActions.map((action, index) => (
          <Card key={index} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <action.icon className={`h-6 w-6 ${action.color}`} />
                <div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{formatCurrency(action.current)} / {formatCurrency(action.target)}</span>
                </div>
                <Progress 
                  value={Math.min(100, (action.current / action.target) * 100)} 
                  className="h-2"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">
                    {Math.round((action.current / action.target) * 100)}% Complete
                  </span>
                  <Button size="sm" variant="outline">
                    Update Goal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Tips */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Smart Recommendations
          </CardTitle>
          <CardDescription>
            Personalized tips based on your financial activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {savingsRate < 10 && (
              <div className="p-3 bg-yellow-100 rounded-lg border-l-4 border-yellow-500">
                <p className="text-sm font-medium text-yellow-800">
                  💡 Try to save at least 10% of your income. Consider reducing discretionary spending.
                </p>
              </div>
            )}
            {avgBudgetUtilization > 90 && (
              <div className="p-3 bg-red-100 rounded-lg border-l-4 border-red-500">
                <p className="text-sm font-medium text-red-800">
                  ⚠️ You're over budget in several categories. Review your spending patterns.
                </p>
              </div>
            )}
            {totalIncome > totalExpenses && savingsRate >= 20 && (
              <div className="p-3 bg-green-100 rounded-lg border-l-4 border-green-500">
                <p className="text-sm font-medium text-green-800">
                  🎉 Great job! You're saving {Math.round(savingsRate)}% of your income.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportantFeatures;
