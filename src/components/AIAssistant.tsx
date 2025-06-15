import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Transaction, Budget } from "@/types/finance";
import { MessageCircle, Send, Bot, User, Sparkles, TrendingUp, PiggyBank } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIAssistantProps {
  transactions: Transaction[];
  budgets: Budget[];
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIAssistant = ({ transactions, budgets }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "👋 Hello! I'm your AI financial assistant. I can help you analyze your spending, create budgets, and provide personalized financial advice. Try asking me 'How can I save more next month?' or 'What's my biggest expense category?'",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const analyzeFinances = (question: string): string => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const savings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    // Analyze expenses by category
    const expensesByCategory: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    const sortedExpenses = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a);

    const question_lower = question.toLowerCase();

    if (question_lower.includes('save more') || question_lower.includes('savings')) {
      if (savingsRate < 10) {
        return `Your current savings rate is ${savingsRate.toFixed(1)}%, which is below the recommended 10-20%. Here are some ways to save more:

1. **Reduce your biggest expense**: Your top spending category is ${sortedExpenses[0]?.[0] || 'N/A'} at $${sortedExpenses[0]?.[1]?.toFixed(2) || '0'}
2. **Set up automatic transfers**: Move money to savings right after you get paid
3. **Track small expenses**: They add up quickly!
4. **Consider the 50/30/20 rule**: 50% needs, 30% wants, 20% savings

Your current monthly surplus/deficit: $${savings.toFixed(2)}`;
      } else {
        return `Great job! Your savings rate is ${savingsRate.toFixed(1)}%, which is healthy. To save even more:

1. **Optimize your ${sortedExpenses[0]?.[0] || 'top'} spending** - currently $${sortedExpenses[0]?.[1]?.toFixed(2) || '0'}
2. **Increase your income** through side hustles or skill development
3. **Automate investments** to grow your money over time

Keep up the excellent work!`;
      }
    }

    if (question_lower.includes('biggest expense') || question_lower.includes('spending most')) {
      if (sortedExpenses.length === 0) {
        return "You haven't recorded any expenses yet. Start adding your transactions to get personalized insights!";
      }
      
      let response = `Your biggest expense categories are:\n\n`;
      sortedExpenses.slice(0, 3).forEach(([category, amount], index) => {
        response += `${index + 1}. **${category}**: $${amount.toFixed(2)}\n`;
      });
      
      response += `\nConsider reviewing your ${sortedExpenses[0][0]} spending to find potential savings opportunities.`;
      return response;
    }

    if (question_lower.includes('budget') || question_lower.includes('spending limit')) {
      if (budgets.length === 0) {
        return "You haven't set up any budgets yet! I recommend creating budgets for your top spending categories. Start with the 'Budget' tab to set spending limits.";
      }
      
      let response = "Here's your budget overview:\n\n";
      budgets.forEach(budget => {
        const spent = expensesByCategory[budget.category] || 0;
        const remaining = budget.limit - spent;
        const percentage = (spent / budget.limit) * 100;
        
        response += `**${budget.category}** (${budget.period}): $${spent.toFixed(2)}/$${budget.limit.toFixed(2)} - ${percentage.toFixed(1)}% used\n`;
        
        if (percentage > 90) {
          response += `⚠️ You're close to your limit!\n`;
        } else if (percentage > 100) {
          response += `🚨 You've exceeded your budget by $${Math.abs(remaining).toFixed(2)}!\n`;
        }
        response += `\n`;
      });
      
      return response;
    }

    if (question_lower.includes('income') || question_lower.includes('earn')) {
      return `Your total recorded income is $${totalIncome.toFixed(2)}. ${totalIncome === 0 ? "Consider adding your income sources to get better financial insights!" : `Your income covers ${totalExpenses > 0 ? ((totalIncome / totalExpenses) * 100).toFixed(1) : 'N/A'}% of your expenses.`}`;
    }

    // Default response
    return `I can help you with various financial questions! Try asking about:
    
• "How can I save more next month?"
• "What's my biggest expense category?"
• "How am I doing with my budget?"
• "What's my savings rate?"

Based on your current data:
- Total Income: $${totalIncome.toFixed(2)}
- Total Expenses: $${totalExpenses.toFixed(2)}
- Net Savings: $${savings.toFixed(2)}
- Savings Rate: ${savingsRate.toFixed(1)}%`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: analyzeFinances(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-indigo-50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Bot className="h-8 w-8" />
              </div>
              AI Financial Assistant
              <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg mt-2">
              Get personalized financial advice powered by intelligent analysis
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <ScrollArea className="h-96 border-2 border-blue-100 rounded-xl p-6 bg-white/60 backdrop-blur-sm shadow-inner">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-500'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
                          <Bot className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div className={`rounded-2xl p-4 shadow-lg backdrop-blur-sm ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                          : 'bg-white/90 text-gray-800 border border-gray-100'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-line font-medium">{message.content}</p>
                        <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 justify-start">
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="rounded-2xl p-4 bg-white/90 shadow-lg backdrop-blur-sm border border-gray-100">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-3">
              <Input
                placeholder="Ask me about your finances..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="h-12 text-base border-2 border-blue-200 focus:border-blue-400 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
                className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg transition-all duration-200"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <TrendingUp className="h-6 w-6" />
            Quick Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              variant="outline"
              className="h-auto p-6 text-left justify-start border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl transition-all duration-200 bg-white/60 backdrop-blur-sm"
              onClick={() => setInputMessage("How can I save more next month?")}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
                  <PiggyBank className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900">Savings Tips</p>
                  <p className="text-sm text-gray-600 mt-1">Get personalized advice to boost your savings</p>
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-6 text-left justify-start border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl transition-all duration-200 bg-white/60 backdrop-blur-sm"
              onClick={() => setInputMessage("What's my biggest expense category?")}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900">Spending Analysis</p>
                  <p className="text-sm text-gray-600 mt-1">Discover where your money goes</p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
