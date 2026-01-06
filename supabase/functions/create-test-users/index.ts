import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const testProfiles = [
  {
    email: "test1@vestra.app",
    password: "testpass123",
    pseudonym: "CalmExplorer42",
    bio: "Finding my way through anxiety one day at a time. Love hiking and journaling.",
    journeyStage: "exploring",
    challenges: ["anxiety", "stress", "sleep"],
    supportPreferences: ["just_chatting", "peer_support"],
    boundaries: {
      allow_direct_messages: true,
      allow_group_chats: true,
      preferred_response_time: "flexible",
    }
  },
  {
    email: "test2@vestra.app",
    password: "testpass123",
    pseudonym: "BraveHeart88",
    bio: "Post-diagnosis journey with ADHD. Learning to embrace my neurodivergent brain!",
    journeyStage: "post_diagnosis",
    challenges: ["adhd", "neurodiversity", "self_esteem"],
    supportPreferences: ["guided_insights", "professional_resources"],
    boundaries: {
      allow_direct_messages: true,
      allow_group_chats: false,
      preferred_response_time: "within_day",
    }
  },
  {
    email: "test3@vestra.app",
    password: "testpass123",
    pseudonym: "GentleSoul23",
    bio: "Supporting my partner through their mental health journey. Here to learn and connect.",
    journeyStage: "supporting_others",
    challenges: ["relationships", "stress", "grief"],
    supportPreferences: ["just_chatting", "professional_resources"],
    boundaries: {
      allow_direct_messages: true,
      allow_group_chats: true,
      preferred_response_time: "whenever",
    }
  },
  {
    email: "test4@vestra.app",
    password: "testpass123",
    pseudonym: "HopefulWanderer",
    bio: "Awaiting assessment for autism. The waiting is hard but I'm hopeful.",
    journeyStage: "awaiting_diagnosis",
    challenges: ["autism", "anxiety", "neurodiversity", "sleep"],
    supportPreferences: ["peer_support", "guided_insights"],
    boundaries: {
      allow_direct_messages: false,
      allow_group_chats: true,
      preferred_response_time: "within_hours",
    }
  },
  {
    email: "test5@vestra.app",
    password: "testpass123",
    pseudonym: "SereneDreamer",
    bio: "Living with depression and finding small joys every day. Coffee enthusiast ☕",
    journeyStage: "post_diagnosis",
    challenges: ["depression", "anxiety", "self_esteem", "bipolar"],
    supportPreferences: ["just_chatting", "peer_support", "guided_insights"],
    boundaries: {
      allow_direct_messages: true,
      allow_group_chats: true,
      preferred_response_time: "flexible",
    }
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create admin client with service role
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const results = [];

    for (const profile of testProfiles) {
      console.log(`Creating user: ${profile.email}`);

      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === profile.email);

      let userId: string;

      if (existingUser) {
        console.log(`User ${profile.email} already exists, using existing ID`);
        userId = existingUser.id;
      } else {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: profile.email,
          password: profile.password,
          email_confirm: true,
        });

        if (authError) {
          console.error(`Error creating user ${profile.email}:`, authError);
          results.push({ email: profile.email, success: false, error: authError.message });
          continue;
        }

        userId = authData.user.id;
        console.log(`Created user ${profile.email} with ID: ${userId}`);
      }

      // Update profile (created by trigger)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          pseudonym: profile.pseudonym,
          bio: profile.bio,
          onboarding_completed: true,
        })
        .eq('user_id', userId);

      if (profileError) {
        console.error(`Error updating profile for ${profile.email}:`, profileError);
      }

      // Insert journey stage
      const { error: journeyError } = await supabase
        .from('user_journey_stages')
        .upsert({
          user_id: userId,
          stage: profile.journeyStage,
        }, { onConflict: 'user_id' });

      if (journeyError) {
        console.error(`Error inserting journey for ${profile.email}:`, journeyError);
      }

      // Insert challenges
      await supabase
        .from('user_challenges')
        .delete()
        .eq('user_id', userId);

      for (const challenge of profile.challenges) {
        await supabase
          .from('user_challenges')
          .insert({
            user_id: userId,
            challenge: challenge,
          });
      }

      // Insert support preferences
      await supabase
        .from('user_support_preferences')
        .delete()
        .eq('user_id', userId);

      for (const pref of profile.supportPreferences) {
        await supabase
          .from('user_support_preferences')
          .insert({
            user_id: userId,
            preference: pref,
          });
      }

      // Insert boundaries
      const { error: boundariesError } = await supabase
        .from('user_boundaries')
        .upsert({
          user_id: userId,
          ...profile.boundaries,
        }, { onConflict: 'user_id' });

      if (boundariesError) {
        console.error(`Error inserting boundaries for ${profile.email}:`, boundariesError);
      }

      results.push({ email: profile.email, success: true, userId });
    }

    console.log('Test users creation completed:', results);

    return new Response(
      JSON.stringify({ 
        message: 'Test users created successfully', 
        results,
        loginCredentials: testProfiles.map(p => ({ email: p.email, password: p.password }))
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in create-test-users:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
