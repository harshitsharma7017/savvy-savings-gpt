
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionForm from "@/components/TransactionForm";
import BudgetPlanner from "@/components/BudgetPlanner";
import Dashboard from "@/components/Dashboard";
import AIAssistant from "@/components/AIAssistant";
import BillsManager from "@/components/BillsManager";
import ImportantFeatures from "@/components/ImportantFeatures";
import StreaksRewards from "@/components/StreaksRewards";
import Challenges from "@/components/Challenges";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TransactionList from "@/components/TransactionList";
import AppSidebar from "@/components/AppSidebar";
import { useTransactions } from "@/hooks/useTransactions";
import { useBudgets } from "@/hooks/useBudgets";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Wallet } from "lucide-react";

const Index = () => {
  const { transactions, loading: transactionsLoading, addTransaction, deleteTransaction } = useTransactions();
  const { budgets, loading: budgetsLoading, addBudget } = useBudgets();
  const [activeTab, setActiveTab] = useState("dashboard");

  const isLoading = transactionsLoading || budgetsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard transactions={transactions} budgets={budgets} onDeleteTransaction={deleteTransaction} />;
      case "transactions":
        return (
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Wallet className="h-6 w-6" />
                  Add Transaction
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Record your income and expenses to track your financial activity
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <TransactionForm onAddTransaction={addTransaction} />
              </CardContent>
            </Card>
            <TransactionList transactions={transactions} onDeleteTransaction={deleteTransaction} />
          </div>
        );
      case "budget":
        return <BudgetPlanner budgets={budgets} transactions={transactions} onAddBudget={addBudget} />;
      case "bills":
        return <BillsManager />;
      case "features":
        return <ImportantFeatures transactions={transactions} budgets={budgets} />;
      case "rewards":
        return <StreaksRewards transactions={transactions} budgets={budgets} />;
      case "challenges":
        return <Challenges transactions={transactions} />;
      case "ai-assistant":
        return <AIAssistant transactions={transactions} budgets={budgets} />;
      default:
        return <Dashboard transactions={transactions} budgets={budgets} onDeleteTransaction={deleteTransaction} />;
    }
  };

  return (
    <CurrencyProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex w-full">
          <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <SidebarInset className="flex-1">
            <Header />
            
            <main className="flex-1">
              <div className="container mx-auto p-6 max-w-7xl">
                <div className="mb-12 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                      <Wallet className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                      Auto Fund
                    </h1>
                  </div>
                  <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Take control of your financial future with AI-powered insights and intelligent budgeting
                  </p>
                </div>

                <div className="animate-fade-in">
                  {renderContent()}
                </div>
              </div>
            </main>

            <Footer />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </CurrencyProvider>
  );
};

export default Index;
