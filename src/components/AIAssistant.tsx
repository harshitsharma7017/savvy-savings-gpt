
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Transaction, Budget } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User } from "lucide-react";

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
      content: "Hello! I'm your AI budgeting assistant. I can help you analyze your spending patterns, suggest ways to save money, and provide personalized financial advice. Try asking me something like 'How can I save more next month?' or 'What are my biggest expenses?'",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Calculate some basic stats
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const savings = totalIncome - totalExpenses;
    
    // Category analysis
    const expensesByCategory: { [key: string]: number } = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    });
    
    const topExpenseCategory = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a)[0];

    // Generate contextual responses
    if (lowerMessage.includes('save') && lowerMessage.includes('month')) {
      if (savings < 0) {
        return `I notice you're spending more than you earn (${Math.abs(savings).toFixed(2)} over budget). Here are some ways to save next month:

1. **Reduce your biggest expense**: Your highest spending category is "${topExpenseCategory?.[0] || 'unknown'}" at $${topExpenseCategory?.[1]?.toFixed(2) || '0'}. Try to cut this by 20%.

2. **Track daily expenses**: Small purchases add up quickly. Consider using the 50/30/20 rule: 50% needs, 30% wants, 20% savings.

3. **Set a realistic budget**: Create budgets for each category and stick to them.

4. **Find cheaper alternatives**: Look for discounts, compare prices, and consider generic brands.

Would you like me to help you create a specific savings plan?`;
      } else {
        return `Great news! You're already saving $${savings.toFixed(2)}. To save even more next month:

1. **Automate your savings**: Set up automatic transfers to savings accounts.

2. **Challenge yourself**: Try to reduce your "${topExpenseCategory?.[0] || 'top spending'}" category by 10%.

3. **Use the envelope method**: Allocate cash for discretionary spending categories.

4. **Review subscriptions**: Cancel unused memberships and services.

Your current savings rate is ${((savings/totalIncome)*100).toFixed(1)}%. Aim for at least 20% if possible!`;
      }
    }
    
    if (lowerMessage.includes('biggest') && lowerMessage.includes('expense')) {
      if (topExpenseCategory) {
        return `Your biggest expense category is **${topExpenseCategory[0]}** with $${topExpenseCategory[1].toFixed(2)} spent.

Here's your expense breakdown:
${Object.entries(expensesByCategory)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .map(([cat, amount], i) => `${i + 1}. ${cat}: $${amount.toFixed(2)}`)
  .join('\n')}

Consider focusing on reducing your top 2-3 categories for maximum impact on your budget.`;
      } else {
        return "I don't see any expense data yet. Start by adding some transactions to get personalized insights about your spending patterns!";
      }
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('plan')) {
      return `Based on your current financial situation:

**Income**: $${totalIncome.toFixed(2)}
**Expenses**: $${totalExpenses.toFixed(2)}
**Net**: $${savings.toFixed(2)}

Here's a recommended budget plan using the 50/30/20 rule:
- **Needs (50%)**: $${(totalIncome * 0.5).toFixed(2)} - housing, utilities, groceries, minimum debt payments
- **Wants (30%)**: $${(totalIncome * 0.3).toFixed(2)} - entertainment, dining out, hobbies
- **Savings (20%)**: $${(totalIncome * 0.2).toFixed(2)} - emergency fund, investments, extra debt payments

${budgets.length > 0 ? `You currently have ${budgets.length} budget(s) set up. Great start!` : 'Consider creating budgets for your major expense categories.'}`;
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('fund')) {
      const monthlyExpenses = totalExpenses; // Assuming current data represents monthly
      const recommendedEmergencyFund = monthlyExpenses * 6;
      
      return `An emergency fund should cover 3-6 months of expenses. Based on your spending:

**Your monthly expenses**: ~$${monthlyExpenses.toFixed(2)}
**Recommended emergency fund**: $${recommendedEmergencyFund.toFixed(2)}

Start with a goal of $1,000, then build up to one month of expenses, then gradually increase to 6 months. Even $25-50 per month adds up over time!`;
    }
    
    // Default responses for common topics
    if (lowerMessage.includes('debt')) {
      return "For debt management, I recommend the debt avalanche method: pay minimums on all debts, then focus extra payments on the highest interest rate debt. This saves you the most money long-term.";
    }
    
    if (lowerMessage.includes('invest')) {
      return "Before investing, ensure you have an emergency fund and are contributing to any employer 401k match. For beginners, consider low-cost index funds or target-date funds. Always do your research or consult a financial advisor!";
    }
    
    // Generic helpful response
    return `I'd be happy to help with your finances! Here are some things I can assist with:

- Analyzing your spending patterns
- Suggesting ways to save money
- Creating budget recommendations
- Emergency fund planning
- Debt management strategies
- General financial tips

Try asking me about your biggest expenses, how to save more, or request a budget analysis!`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    set loading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Budgeting Assistant
        </CardTitle>
        <CardDescription>
          Get personalized financial advice and insights based on your spending patterns
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about your finances..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
