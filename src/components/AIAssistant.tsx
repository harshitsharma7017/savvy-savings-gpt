
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Transaction, Budget } from "@/types/finance";
import { MessageCircle, Send, Bot, User } from "lucide-react";
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
      content: "Hello! I'm your AI financial assistant. I can help you analyze your spending, create budgets, and provide personalized financial advice. Try asking me 'How can I save more next month?' or 'What's my biggest expense category?'",
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Financial Assistant
          </CardTitle>
          <CardDescription>
            Get personalized financial advice based on your spending patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ScrollArea className="h-96 border rounded-md p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex gap-2 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-500">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="rounded-lg p-3 bg-gray-100">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                placeholder="Ask me about your finances..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => setInputMessage("How can I save more next month?")}
            >
              <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Savings Tips</p>
                <p className="text-sm text-muted-foreground">Get personalized advice</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => setInputMessage("What's my biggest expense category?")}
            >
              <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Spending Analysis</p>
                <p className="text-sm text-muted-foreground">Analyze your expenses</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
