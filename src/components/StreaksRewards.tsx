
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  PiggyBank, 
  Calendar,
  Award,
  Star,
  Flame,
  CheckCircle
} from "lucide-react";
import { Transaction, Budget } from "@/types/finance";
import { useCurrency } from "@/contexts/CurrencyContext";

interface StreaksRewardsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  type: 'badge' | 'streak' | 'milestone';
  earned: boolean;
  earnedDate?: Date;
  progress?: number;
  target?: number;
  color: string;
}

const StreaksRewards = ({ transactions, budgets }: StreaksRewardsProps) => {
  const { formatCurrency } = useCurrency();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  // Calculate streaks and achievements
  useEffect(() => {
    calculateAchievements();
  }, [transactions, budgets]);

  const calculateAchievements = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
    const transactionDays = [...new Set(transactions.map(t => t.date.split('T')[0]))].length;
    
    // Calculate current streak (consecutive days with transactions)
    const sortedDates = [...new Set(transactions.map(t => t.date.split('T')[0]))].sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    if (sortedDates.length > 0) {
      let currentDate = new Date(today);
      for (let i = 0; i < sortedDates.length; i++) {
        const transactionDate = new Date(sortedDates[i]);
        const daysDiff = Math.floor((currentDate.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= i + 1) {
          streak++;
        } else {
          break;
        }
      }
    }
    
    setCurrentStreak(streak);

    const newAchievements: Achievement[] = [
      {
        id: 'first-transaction',
        title: 'Getting Started',
        description: 'Added your first transaction',
        icon: CheckCircle,
        type: 'badge',
        earned: transactions.length > 0,
        earnedDate: transactions.length > 0 ? new Date(transactions[0].date) : undefined,
        color: 'bg-green-100 text-green-800'
      },
      {
        id: 'budget-master',
        title: 'Budget Master',
        description: 'Created your first budget',
        icon: Target,
        type: 'badge',
        earned: budgets.length > 0,
        color: 'bg-blue-100 text-blue-800'
      },
      {
        id: 'saver',
        title: 'Smart Saver',
        description: 'Achieved 20% savings rate',
        icon: PiggyBank,
        type: 'milestone',
        earned: savingsRate >= 20,
        progress: Math.min(100, (savingsRate / 20) * 100),
        target: 20,
        color: 'bg-purple-100 text-purple-800'
      },
      {
        id: 'consistent',
        title: 'Consistency Champion',
        description: 'Tracked expenses for 7 consecutive days',
        icon: Calendar,
        type: 'streak',
        earned: streak >= 7,
        progress: Math.min(100, (streak / 7) * 100),
        target: 7,
        color: 'bg-orange-100 text-orange-800'
      },
      {
        id: 'active-tracker',
        title: 'Active Tracker',
        description: 'Logged transactions on 10 different days',
        icon: TrendingUp,
        type: 'milestone',
        earned: transactionDays >= 10,
        progress: Math.min(100, (transactionDays / 10) * 100),
        target: 10,
        color: 'bg-indigo-100 text-indigo-800'
      },
      {
        id: 'big-spender',
        title: 'High Roller',
        description: 'Tracked over $1000 in transactions',
        icon: Trophy,
        type: 'milestone',
        earned: (totalIncome + totalExpenses) >= 1000,
        progress: Math.min(100, ((totalIncome + totalExpenses) / 1000) * 100),
        target: 1000,
        color: 'bg-yellow-100 text-yellow-800'
      }
    ];

    setAchievements(newAchievements);
    
    // Calculate total points
    const points = newAchievements.filter(a => a.earned).length * 10 + streak * 2;
    setTotalPoints(points);
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const unearned = achievements.filter(a => !a.earned);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Current Streak */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-600" />
              <CardTitle className="text-lg">Current Streak</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{currentStreak}</div>
            <p className="text-sm text-gray-600">consecutive days</p>
          </CardContent>
        </Card>

        {/* Total Points */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-lg">Total Points</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{totalPoints}</div>
            <p className="text-sm text-gray-600">achievement points</p>
          </CardContent>
        </Card>

        {/* Badges Earned */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-green-600" />
              <CardTitle className="text-lg">Badges Earned</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{earnedAchievements.length}</div>
            <p className="text-sm text-gray-600">out of {achievements.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Earned Achievements */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Earned Achievements
          </CardTitle>
          <CardDescription>Your accomplishments so far</CardDescription>
        </CardHeader>
        <CardContent>
          {earnedAchievements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No achievements yet. Start tracking your finances!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {earnedAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                  <achievement.icon className="h-8 w-8 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    {achievement.earnedDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Earned: {achievement.earnedDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Badge className={achievement.color}>
                    {achievement.type === 'streak' ? 'Streak' : 
                     achievement.type === 'milestone' ? 'Milestone' : 'Badge'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Towards Next Achievements */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Progress Towards Next Achievements
          </CardTitle>
          <CardDescription>Keep going to unlock these rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {unearned.map((achievement) => (
              <div key={achievement.id} className="p-4 rounded-lg border">
                <div className="flex items-center gap-3 mb-3">
                  <achievement.icon className="h-6 w-6 text-gray-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  <Badge variant="outline" className={achievement.color}>
                    {achievement.type === 'streak' ? 'Streak' : 
                     achievement.type === 'milestone' ? 'Milestone' : 'Badge'}
                  </Badge>
                </div>
                {achievement.progress !== undefined && achievement.target && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(achievement.progress)}%</span>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreaksRewards;
