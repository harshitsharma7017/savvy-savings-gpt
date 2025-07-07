
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useTransactions } from "@/hooks/useTransactions";
import { useBudgets } from "@/hooks/useBudgets";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { Wallet, TrendingUp, Target, Bot, Receipt, Star, Trophy, Zap } from "lucide-react";

const Index = () => {
  const { transactions, loading: transactionsLoading, addTransaction, deleteTransaction } = useTransactions();
  const { budgets, loading: budgetsLoading, addBudget } = useBudgets();

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

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
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

            <Tabs defaultValue="dashboard" className="space-y-8">
              <TabsList className="grid w-full grid-cols-8 bg-white/80 backdrop-blur-sm border shadow-lg rounded-xl p-2 h-16">
                <TabsTrigger 
                  value="dashboard" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
                >
                  <TrendingUp className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="transactions" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
                >
                  <Wallet className="h-4 w-4" />
                  Transactions
                </TabsTrigger>
                <TabsTrigger 
                  value="budget" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
                >
                  <Target className="h-4 w-4" />
                  Budget
                </TabsTrigger>
                <TabsTrigger 
                  value="bills" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
                >
                  <Receipt className="h-4 w-4" />
                  Bills
                </TabsTrigger>
                <TabsTrigger 
                  value="features" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
                >
                  <Star className="h-4 w-4" />
                  Features
                </TabsTrigger>
                <TabsTrigger 
                  value="rewards" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
                >
                  <Trophy className="h-4 w-4" />
                  Rewards
                </TabsTrigger>
                <TabsTrigger 
                  value="challenges" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
                >
                  <Zap className="h-4 w-4" />
                  Challenges
                </TabsTrigger>
                <TabsTrigger 
                  value="ai-assistant" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
                >
                  <Bot className="h-4 w-4" />
                  AI Assistant
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="animate-fade-in">
                <Dashboard transactions={transactions} budgets={budgets} onDeleteTransaction={deleteTransaction} />
              </TabsContent>

              <TabsContent value="transactions" className="animate-fade-in space-y-6">
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
              </TabsContent>

              <TabsContent value="budget" className="animate-fade-in">
                <BudgetPlanner budgets={budgets} transactions={transactions} onAddBudget={addBudget} />
              </TabsContent>

              <TabsContent value="bills" className="animate-fade-in">
                <BillsManager />
              </TabsContent>

              <TabsContent value="features" className="animate-fade-in">
                <ImportantFeatures transactions={transactions} budgets={budgets} />
              </TabsContent>

              <TabsContent value="rewards" className="animate-fade-in">
                <StreaksRewards transactions={transactions} budgets={budgets} />
              </TabsContent>

              <TabsContent value="challenges" className="animate-fade-in">
                <Challenges transactions={transactions} />
              </TabsContent>

              <TabsContent value="ai-assistant" className="animate-fade-in">
                <AIAssistant transactions={transactions} budgets={budgets} />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </CurrencyProvider>
  );
};

export default Index;
