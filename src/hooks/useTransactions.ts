
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/finance';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedTransactions: Transaction[] = data.map(t => ({
        id: t.id,
        type: t.type as 'income' | 'expense',
        amount: t.amount,
        category: t.category,
        description: t.description || '',
        date: t.date
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description,
          date: transaction.date
        }])
        .select()
        .single();

      if (error) throw error;

      const newTransaction: Transaction = {
        id: data.id,
        type: data.type as 'income' | 'expense',
        amount: data.amount,
        category: data.category,
        description: data.description || '',
        date: data.date
      };

      setTransactions(prev => [newTransaction, ...prev]);
      
      toast({
        title: "Success",
        description: "Transaction added successfully!",
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: "Success",
        description: "Transaction deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
};
