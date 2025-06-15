
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Budget } from '@/types/finance';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedBudgets: Budget[] = data.map(b => ({
        id: b.id,
        category: b.category,
        limit: parseFloat(b.limit_amount),
        period: b.period as 'monthly' | 'weekly' | 'yearly'
      }));

      setBudgets(formattedBudgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch budgets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      // Check if budget already exists for this category and period
      const { data: existing } = await supabase
        .from('budgets')
        .select('id')
        .eq('category', budget.category)
        .eq('period', budget.period)
        .single();

      if (existing) {
        toast({
          title: "Error",
          description: "Budget for this category and period already exists",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('budgets')
        .insert([{
          category: budget.category,
          limit_amount: budget.limit,
          period: budget.period
        }])
        .select()
        .single();

      if (error) throw error;

      const newBudget: Budget = {
        id: data.id,
        category: data.category,
        limit: parseFloat(data.limit_amount),
        period: data.period as 'monthly' | 'weekly' | 'yearly'
      };

      setBudgets(prev => [newBudget, ...prev]);
      
      toast({
        title: "Success",
        description: "Budget created successfully!",
      });
    } catch (error) {
      console.error('Error adding budget:', error);
      toast({
        title: "Error",
        description: "Failed to create budget",
        variant: "destructive",
      });
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBudgets(prev => prev.filter(b => b.id !== id));
      
      toast({
        title: "Success",
        description: "Budget deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return {
    budgets,
    loading,
    addBudget,
    deleteBudget,
    refetch: fetchBudgets
  };
};
