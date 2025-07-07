
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
  CheckCircle,
  DollarSign,
  Zap,
  Shield
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
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
}

const StreaksRewards = ({ transactions, budgets }: StreaksRewardsProps) => {
  const { formatCurrency } = useCurrency();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);

  // Calculate dynamic achievements based on user data
  useEffect(() => {
    calculateDynamicAchievements();
  }, [transactions, budgets]);

  const calculateDynamicAchievements = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsAmount = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
    const transactionDays = [...new Set(transactions.map(t => t.date.split('T')[0]))].length;
    const avgTransactionAmount = transactions.length > 0 ? 
      transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length : 0;
    
    // Calculate streak
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

    // Dynamic achievement generation based on user behavior
    const dynamicAchievements: Achievement[] = [
      // Basic achievements
      {
        id: 'first-transaction',
        title: 'Financial Journey Begins',
        description: 'Recorded your first transaction',
        icon: CheckCircle,
        type: 'badge',
        earned: transactions.length > 0,
        earnedDate: transactions.length > 0 ? new Date(transactions[0].date) : undefined,
        color: 'bg-green-100 text-green-800',
        tier: 'bronze',
        points: 10
      },
      
      // Adaptive streak achievements
      {
        id: 'streak-beginner',
        title: 'Consistency Starter',
        description: `Track expenses for ${Math.max(3, Math.floor(transactionDays / 3))} consecutive days`,
        icon: Calendar,
        type: 'streak',
        earned: streak >= Math.max(3, Math.floor(transactionDays / 3)),
        progress: Math.min(100, (streak / Math.max(3, Math.floor(transactionDays / 3))) * 100),
        target: Math.max(3, Math.floor(transactionDays / 3)),
        color: 'bg-orange-100 text-orange-800',
        tier: 'bronze',
        points: 25
      },

      // Savings-based achievements (adaptive to user's income level)
      {
        id: 'smart-saver',
        title: savingsRate > 30 ? 'Super Saver' : savingsRate > 15 ? 'Smart Saver' : 'Savings Starter',
        description: `Achieve ${savingsRate > 30 ? '30%' : savingsRate > 15 ? '20%' : '10%'} savings rate`,
        icon: PiggyBank,
        type: 'milestone',
        earned: savingsRate >= (savingsRate > 30 ? 30 : savingsRate > 15 ? 20 : 10),
        progress: Math.min(100, (savingsRate / (savingsRate > 30 ? 30 : savingsRate > 15 ? 20 : 10)) * 100),
        target: savingsRate > 30 ? 30 : savingsRate > 15 ? 20 : 10,
        color: 'bg-purple-100 text-purple-800',
        tier: savingsRate > 30 ? 'gold' : savingsRate > 15 ? 'silver' : 'bronze',
        points: savingsRate > 30 ? 100 : savingsRate > 15 ? 50 : 25
      },

      // Volume-based achievements (adaptive to user's transaction volume)
      {
        id: 'active-tracker',
        title: transactionDays > 20 ? 'Transaction Master' : 'Active Tracker',
        description: `Log transactions on ${transactionDays > 20 ? '30' : '15'} different days`,
        icon: TrendingUp,
        type: 'milestone',
        earned: transactionDays >= (transactionDays > 20 ? 30 : 15),
        progress: Math.min(100, (transactionDays / (transactionDays > 20 ? 30 : 15)) * 100),
        target: transactionDays > 20 ? 30 : 15,
        color: 'bg-indigo-100 text-indigo-800',
        tier: transactionDays > 20 ? 'silver' : 'bronze',
        points: transactionDays > 20 ? 75 : 40
      },

      // Budget achievements
      {
        id: 'budget-master',
        title: budgets.length > 3 ? 'Budget Guru' : 'Budget Creator',
        description: budgets.length > 3 ? 'Created 5+ budgets' : 'Created your first budget',
        icon: Target,
        type: 'badge',
        earned: budgets.length > 0,
        color: 'bg-blue-100 text-blue-800',
        tier: budgets.length > 3 ? 'gold' : 'bronze',
        points: budgets.length > 3 ? 60 : 20
      },

      // Wealth-based achievements (adaptive to user's financial level)
      {
        id: 'wealth-builder',
        title: totalIncome > 10000 ? 'Wealth Builder' : totalIncome > 5000 ? 'Money Manager' : 'Financial Starter',
        description: `Tracked over ${formatCurrency(totalIncome > 10000 ? 10000 : totalIncome > 5000 ? 5000 : 1000)} in income`,
        icon: DollarSign,
        type: 'milestone',
        earned: totalIncome >= (totalIncome > 10000 ? 10000 : totalIncome > 5000 ? 5000 : 1000),
        progress: Math.min(100, (totalIncome / (totalIncome > 10000 ? 10000 : totalIncome > 5000 ? 5000 : 1000)) * 100),
        target: totalIncome > 10000 ? 10000 : totalIncome > 5000 ? 5000 : 1000,
        color: 'bg-yellow-100 text-yellow-800',
        tier: totalIncome > 10000 ? 'platinum' : totalIncome > 5000 ? 'gold' : 'silver',
        points: totalIncome > 10000 ? 150 : totalIncome > 5000 ? 100 : 50
      },

      // Special achievements
      {
        id: 'power-user',
        title: 'Financial Power User',
        description: 'Complete 5 different achievement types',
        icon: Shield,
        type: 'badge',
        earned: false, // Will be calculated below
        color: 'bg-red-100 text-red-800',
        tier: 'platinum',
        points: 200
      }
    ];

    // Calculate power user achievement
    const earnedCount = dynamicAchievements.filter(a => a.earned).length;
    dynamicAchievements[dynamicAchievements.length - 1].earned = earnedCount >= 5;

    setAchievements(dynamicAchievements);
    
    // Calculate total points and user level
    const points = dynamicAchievements
      .filter(a => a.earned)
      .reduce((sum, a) => sum + a.points, 0) + (streak * 2);
    setTotalPoints(points);
    setUserLevel(Math.floor(points / 100) + 1);
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const unearned = achievements.filter(a => !a.earned);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {/* User Level */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-lg">Level {userLevel}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">Financial Master</div>
            <Progress value={(totalPoints % 100)} className="h-2 mt-2" />
            <div className="text-xs text-gray-500 mt-1">
              {totalPoints % 100}/100 XP to next level
            </div>
          </CardContent>
        </Card>

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
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-green-600" />
              <CardTitle className="text-lg">Total Points</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{totalPoints}</div>
            <p className="text-sm text-gray-600">achievement points</p>
          </CardContent>
        </Card>

        {/* Badges Earned */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-lg">Badges Earned</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{earnedAchievements.length}</div>
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
                <div key={achievement.id} className="flex items-center gap-3 p-4 rounded-lg border bg-gradient-to-r from-gray-50 to-white shadow-sm">
                  <achievement.icon className="h-8 w-8 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getTierColor(achievement.tier)}>
                        {achievement.tier.charAt(0).toUpperCase() + achievement.tier.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-500">+{achievement.points} pts</span>
                    </div>
                    {achievement.earnedDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Earned: {achievement.earnedDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>
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
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getTierColor(achievement.tier)}>
                      {achievement.tier.charAt(0).toUpperCase() + achievement.tier.slice(1)}
                    </Badge>
                    <span className="text-xs text-gray-500">+{achievement.points} pts</span>
                  </div>
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
