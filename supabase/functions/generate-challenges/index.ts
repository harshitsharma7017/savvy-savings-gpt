
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
    console.log('Starting challenge generation...');
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not found');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { userProfile, transactions } = await req.json();
    console.log('User profile:', userProfile);
    console.log('Transaction count:', transactions?.length || 0);

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
            ]
            
            Make sure the response is ONLY the JSON array, no additional text or formatting.`
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

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to generate challenges from OpenAI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('OpenAI response data:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      return new Response(JSON.stringify({ error: 'Invalid response from OpenAI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const messageContent = data.choices[0].message.content;
    console.log('OpenAI message content:', messageContent);

    let generatedChallenges;
    try {
      generatedChallenges = JSON.parse(messageContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.error('Raw content:', messageContent);
      return new Response(JSON.stringify({ error: 'Failed to parse AI response' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!Array.isArray(generatedChallenges)) {
      console.error('Generated challenges is not an array:', generatedChallenges);
      return new Response(JSON.stringify({ error: 'Invalid challenge format from AI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Successfully generated challenges:', generatedChallenges);

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
