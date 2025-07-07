
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  TrendingDown, 
  PiggyBank, 
  Calendar,
  Coffee,
  ShoppingCart,
  Car,
  Utensils,
  CheckCircle,
  X,
  Plus,
  Sparkles,
  Loader2
} from "lucide-react";
import { Transaction } from "@/types/finance";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChallengesProps {
  transactions: Transaction[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'spending_limit' | 'savings_goal' | 'category_ban' | 'streak';
  target: number;
  current: number;
  category?: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
  completed: boolean;
  reward: string;
  difficulty?: string;
  aiGenerated?: boolean;
}

const Challenges = ({ transactions }: ChallengesProps) => {
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const getIconForCategory = (category?: string, type?: string) => {
    if (type === 'savings_goal') return PiggyBank;
    if (type === 'streak') return Calendar;
    
    switch (category) {
      case 'dining': return Coffee;
      case 'shopping': return ShoppingCart;
      case 'transport': return Car;
      case 'food': return Utensils;
      default: return Target;
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Initialize default challenges
  useEffect(() => {
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const defaultChallenges: Challenge[] = [
      {
        id: 'monthly-savings',
        title: 'Monthly Savings Goal',
        description: 'Save $500 this month',
        type: 'savings_goal',
        target: 500,
        current: 0,
        icon: PiggyBank,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        startDate: startOfMonth,
        endDate: endOfMonth,
        active: true,
        completed: false,
        reward: '🏆 Savings Champion Badge',
        difficulty: 'Medium'
      }
    ];

    setChallenges(defaultChallenges);
  }, []);

  // Update challenge progress based on transactions
  useEffect(() => {
    updateChallengeProgress();
  }, [transactions]);

  const updateChallengeProgress = () => {
    setChallenges(prevChallenges => 
      prevChallenges.map(challenge => {
        let current = 0;
        
        const challengeTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= challenge.startDate && transactionDate <= challenge.endDate;
        });

        switch (challenge.type) {
          case 'savings_goal':
            const income = challengeTransactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0);
            const expenses = challengeTransactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);
            current = income - expenses;
            break;

          case 'spending_limit':
            current = challengeTransactions
              .filter(t => t.type === 'expense' && (!challenge.category || t.category === challenge.category))
              .reduce((sum, t) => sum + t.amount, 0);
            break;

          case 'category_ban':
            current = challengeTransactions
              .filter(t => t.type === 'expense' && t.category === challenge.category)
              .reduce((sum, t) => sum + t.amount, 0);
            break;

          case 'streak':
            const uniqueDays = [...new Set(challengeTransactions.map(t => t.date.split('T')[0]))];
            current = uniqueDays.length;
            break;
        }

        const completed = challenge.type === 'category_ban' 
          ? current === 0 
          : current >= challenge.target;

        return {
          ...challenge,
          current,
          completed
        };
      })
    );
  };

  const generateAIChallenges = async () => {
    setIsGenerating(true);
    
    try {
      // Prepare user profile data
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const categorySpending = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);

      const topCategories = Object.entries(categorySpending)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([category]) => category);

      const userProfile = {
        totalTransactions: transactions.length,
        avgMonthlySpending: totalExpenses / Math.max(1, new Date().getMonth() + 1),
        topCategories,
        savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0,
        currentStreak: 0 // Will be calculated by the AI
      };

      const { data, error } = await supabase.functions.invoke('generate-challenges', {
        body: { userProfile, transactions: transactions.slice(0, 10) }
      });

      if (error) throw error;

      // Convert AI challenges to our format
      const currentMonth = new Date();
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const aiChallenges: Challenge[] = data.challenges.map((challenge: any, index: number) => ({
        id: `ai-challenge-${Date.now()}-${index}`,
        title: challenge.title,
        description: challenge.description,
        type: challenge.type,
        target: challenge.target,
        current: 0,
        category: challenge.category,
        icon: getIconForCategory(challenge.category, challenge.type),
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        startDate: startOfMonth,
        endDate: endOfMonth,
        active: true,
        completed: false,
        reward: challenge.reward,
        difficulty: challenge.difficulty,
        aiGenerated: true
      }));

      setChallenges(prev => [...prev, ...aiChallenges]);
      
      toast({
        title: "AI Challenges Generated! 🤖",
        description: `Generated ${aiChallenges.length} personalized challenges based on your spending patterns`,
      });

    } catch (error) {
      console.error('Error generating AI challenges:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI challenges. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getProgressPercentage = (challenge: Challenge) => {
    if (challenge.type === 'category_ban') {
      return challenge.current === 0 ? 100 : 0;
    }
    return Math.min(100, (challenge.current / challenge.target) * 100);
  };

  const getProgressColor = (challenge: Challenge) => {
    const percentage = getProgressPercentage(challenge);
    if (challenge.type === 'category_ban') {
      return challenge.current === 0 ? 'text-green-600' : 'text-red-600';
    }
    if (challenge.type === 'spending_limit') {
      return percentage > 80 ? 'text-red-600' : percentage > 60 ? 'text-yellow-600' : 'text-green-600';
    }
    return percentage >= 100 ? 'text-green-600' : 'text-blue-600';
  };

  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => 
      prev.map(c => 
        c.id === challengeId ? { ...c, completed: true, active: false } : c
      )
    );
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      toast({
        title: "Challenge Completed! 🎉",
        description: `${challenge.title} - ${challenge.reward}`,
      });
    }
  };

  const activeChallenges = challenges.filter(c => c.active);
  const completedChallenges = challenges.filter(c => c.completed);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Financial Challenges
          </h2>
          <p className="text-slate-600 mt-2">Push yourself to build better financial habits</p>
        </div>
        <Button 
          onClick={generateAIChallenges}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generate Challenges
            </>
          )}
        </Button>
      </div>

      {/* Active Challenges */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Active Challenges</h3>
        {activeChallenges.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-500">No active challenges</p>
              <p className="text-sm text-gray-400">Generate AI challenges to start improving your financial habits</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activeChallenges.map((challenge) => (
              <Card key={challenge.id} className={`border-0 shadow-lg ${challenge.bgColor} relative`}>
                {challenge.aiGenerated && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Generated
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <challenge.icon className={`h-6 w-6 ${challenge.color}`} />
                      <div>
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </div>
                    </div>
                    {challenge.completed && (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progress</span>
                      <span className={`text-sm font-bold ${getProgressColor(challenge)}`}>
                        {challenge.type === 'category_ban' 
                          ? challenge.current === 0 ? 'Success!' : `${formatCurrency(challenge.current)} spent`
                          : challenge.type === 'savings_goal' 
                            ? `${formatCurrency(Math.max(0, challenge.current))} saved`
                            : challenge.type === 'spending_limit'
                              ? `${formatCurrency(challenge.current)} / ${formatCurrency(challenge.target)}`
                              : `${challenge.current} / ${challenge.target} days`
                        }
                      </span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(challenge)} 
                      className="h-2"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">
                        Ends: {challenge.endDate.toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        {challenge.difficulty && (
                          <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                        )}
                        <Badge variant="outline" className={challenge.color}>
                          {challenge.reward}
                        </Badge>
                      </div>
                    </div>
                    {challenge.completed && (
                      <Button 
                        onClick={() => completeChallenge(challenge.id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Claim Reward
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Completed Challenges</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {completedChallenges.map((challenge) => (
              <Card key={challenge.id} className="border-0 shadow-lg bg-gray-50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <CardTitle className="text-lg text-gray-700">{challenge.title}</CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-green-100 text-green-800">
                    {challenge.reward}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges;
