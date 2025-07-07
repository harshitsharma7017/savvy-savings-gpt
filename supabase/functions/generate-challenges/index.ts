
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile, transactions } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a financial coach AI that creates personalized monthly challenges based on user spending patterns. 
            Generate exactly 3 financial challenges that are:
            1. Realistic and achievable based on their data
            2. Challenging but not impossible
            3. Focused on building healthy financial habits
            
            Return the response as a valid JSON array with this exact structure:
            [
              {
                "title": "Challenge Title",
                "description": "Challenge description",
                "type": "spending_limit|savings_goal|category_ban|streak",
                "target": number,
                "category": "category_name (only for category_ban or spending_limit)",
                "reward": "reward description",
                "difficulty": "Easy|Medium|Hard"
              }
            ]`
          },
          {
            role: 'user',
            content: `Generate personalized financial challenges based on this user data:
            
            User Profile:
            - Total transactions: ${userProfile.totalTransactions}
            - Average monthly spending: $${userProfile.avgMonthlySpending}
            - Top spending categories: ${userProfile.topCategories.join(', ')}
            - Savings rate: ${userProfile.savingsRate}%
            - Current streak: ${userProfile.currentStreak} days
            
            Recent transactions: ${JSON.stringify(transactions.slice(0, 10))}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const generatedChallenges = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ challenges: generatedChallenges }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-challenges function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
