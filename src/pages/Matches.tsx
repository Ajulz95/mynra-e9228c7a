import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MatchedPeer {
  userId: string;
  pseudonym: string;
  bio: string | null;
  journeyStage: string | null;
  challenges: string[];
}

const journeyLabels: Record<string, string> = {
  exploring: 'Exploring',
  awaiting_diagnosis: 'Awaiting Diagnosis',
  post_diagnosis: 'Post-Diagnosis',
  supporting_others: 'Supporting Others',
};

const challengeEmojis: Record<string, string> = {
  anxiety: '😰',
  depression: '😔',
  neurodiversity: '🧠',
  adhd: '⚡',
  autism: '🌈',
  ocd: '🔄',
  ptsd: '💔',
  eating_disorders: '🍽️',
  bipolar: '🎢',
  grief: '🕊️',
  stress: '🔥',
  relationships: '💑',
  self_esteem: '💪',
  sleep: '😴',
  other: '✨',
};

export default function Matches() {
  const [matches, setMatches] = useState<MatchedPeer[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const loadMatches = async () => {
      if (!user) return;

      try {
        // Get all users where we have mutual accepted requests
        // First, get all users we've sent accepted requests to
        const { data: sentRequests, error: sentError } = await supabase
          .from('connection_requests')
          .select('recipient_id')
          .eq('requester_id', user.id)
          .eq('status', 'accepted');

        if (sentError) throw sentError;

        // Get all users who sent us accepted requests
        const { data: receivedRequests, error: receivedError } = await supabase
          .from('connection_requests')
          .select('requester_id')
          .eq('recipient_id', user.id)
          .eq('status', 'accepted');

        if (receivedError) throw receivedError;

        // Find mutual matches (users in both lists)
        const sentTo = new Set(sentRequests?.map(r => r.recipient_id) || []);
        const receivedFrom = new Set(receivedRequests?.map(r => r.requester_id) || []);
        const matchedUserIds = [...sentTo].filter(id => receivedFrom.has(id));

        if (matchedUserIds.length === 0) {
          setMatches([]);
          setLoading(false);
          return;
        }

        // Fetch profiles for matched users
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, pseudonym, bio')
          .in('user_id', matchedUserIds);

        if (profilesError) throw profilesError;

        // Fetch journey stages
        const { data: journeyStages } = await supabase
          .from('user_journey_stages')
          .select('user_id, stage')
          .in('user_id', matchedUserIds);

        // Fetch challenges
        const { data: challenges } = await supabase
          .from('user_challenges')
          .select('user_id, challenge')
          .in('user_id', matchedUserIds);

        // Build matched peers list
        const matchedPeers: MatchedPeer[] = (profiles || []).map(profile => ({
          userId: profile.user_id,
          pseudonym: profile.pseudonym,
          bio: profile.bio,
          journeyStage: journeyStages?.find(j => j.user_id === profile.user_id)?.stage || null,
          challenges: challenges?.filter(c => c.user_id === profile.user_id).map(c => c.challenge) || [],
        }));

        setMatches(matchedPeers);
      } catch (error: any) {
        toast({
          title: 'Error loading matches',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [user, toast]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">My Matches</h1>
            <p className="text-primary-foreground/80 text-sm">
              {matches.length} {matches.length === 1 ? 'peer' : 'peers'} connected
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No matches yet</h3>
            <p className="text-muted-foreground mb-4">
              Start connecting with peers who share similar experiences
            </p>
            <Button onClick={() => navigate('/discover')}>
              Discover Peers
            </Button>
          </div>
        ) : (
          matches.map((peer) => (
            <Card key={peer.userId} className="shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{peer.pseudonym}</h3>
                      {peer.journeyStage && (
                        <p className="text-sm text-muted-foreground">
                          {journeyLabels[peer.journeyStage] || peer.journeyStage}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/chat/${peer.userId}`)}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                </div>

                {peer.bio && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                    {peer.bio}
                  </p>
                )}

                {peer.challenges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {peer.challenges.slice(0, 4).map((challenge) => (
                      <Badge
                        key={challenge}
                        variant="secondary"
                        className="text-xs px-2 py-0.5"
                      >
                        <span className="mr-1">{challengeEmojis[challenge] || '✨'}</span>
                        {challenge.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                    {peer.challenges.length > 4 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        +{peer.challenges.length - 4}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
