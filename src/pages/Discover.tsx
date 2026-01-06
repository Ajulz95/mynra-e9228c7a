import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import PeerCard from '@/components/discover/PeerCard';
import EmptyState from '@/components/discover/EmptyState';
import NotificationBell from '@/components/notifications/NotificationBell';
import BottomNav from '@/components/BottomNav';

export interface PeerProfile {
  userId: string;
  pseudonym: string;
  bio: string | null;
  journeyStage: string | null;
  challenges: string[];
  supportPreferences: string[];
  connectionStatus: 'none' | 'pending_sent' | 'pending_received' | 'awaiting_match' | 'matched';
  sharedChallenges: string[];
}

export default function Discover() {
  const [peers, setPeers] = useState<PeerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userChallenges, setUserChallenges] = useState<string[]>([]);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const loadPeers = async () => {
    if (!user) return;

    try {
      // Get current user's challenges for matching
      const { data: myChallenges } = await supabase
        .from('user_challenges')
        .select('challenge')
        .eq('user_id', user.id);

      const challengeList = myChallenges?.map(c => c.challenge) || [];
      setUserChallenges(challengeList);

      // Get all completed profiles except current user
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, pseudonym, bio')
        .eq('onboarding_completed', true)
        .neq('user_id', user.id);

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) {
        setPeers([]);
        return;
      }

      // For each profile, get their data
      const peerProfiles: PeerProfile[] = await Promise.all(
        profiles.map(async (profile) => {
          // Get journey stage
          const { data: journeyData } = await supabase
            .from('user_journey_stages')
            .select('stage')
            .eq('user_id', profile.user_id)
            .maybeSingle();

          // Get challenges
          const { data: challengesData } = await supabase
            .from('user_challenges')
            .select('challenge')
            .eq('user_id', profile.user_id);

          // Get support preferences
          const { data: prefsData } = await supabase
            .from('user_support_preferences')
            .select('preference')
            .eq('user_id', profile.user_id);

          // Get connection status
          const { data: sentRequest } = await supabase
            .from('connection_requests')
            .select('status')
            .eq('requester_id', user.id)
            .eq('recipient_id', profile.user_id)
            .maybeSingle();

          const { data: receivedRequest } = await supabase
            .from('connection_requests')
            .select('status')
            .eq('requester_id', profile.user_id)
            .eq('recipient_id', user.id)
            .maybeSingle();

          let connectionStatus: PeerProfile['connectionStatus'] = 'none';
          
          if (sentRequest?.status === 'accepted' && receivedRequest?.status === 'accepted') {
            connectionStatus = 'matched';
          } else if (sentRequest?.status === 'pending') {
            connectionStatus = 'pending_sent';
          } else if (receivedRequest?.status === 'pending') {
            connectionStatus = 'pending_received';
          } else if (sentRequest?.status === 'accepted') {
            connectionStatus = 'awaiting_match';
          }

          const peerChallenges = challengesData?.map(c => c.challenge) || [];
          const sharedChallenges = peerChallenges.filter(c => challengeList.includes(c));

          return {
            userId: profile.user_id,
            pseudonym: profile.pseudonym,
            bio: profile.bio,
            journeyStage: journeyData?.stage || null,
            challenges: peerChallenges,
            supportPreferences: prefsData?.map(p => p.preference) || [],
            connectionStatus,
            sharedChallenges,
          };
        })
      );

      // Sort by shared challenges (most shared first)
      peerProfiles.sort((a, b) => b.sharedChallenges.length - a.sharedChallenges.length);

      setPeers(peerProfiles);
    } catch (error: any) {
      toast({
        title: 'Error loading peers',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPeers();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadPeers();
  };

  const handleConnect = async (peerId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('connection_requests')
        .insert({
          requester_id: user.id,
          recipient_id: peerId,
          status: 'pending',
        });

      if (error) throw error;

      // Update local state
      setPeers(prev => prev.map(p => 
        p.userId === peerId 
          ? { ...p, connectionStatus: 'pending_sent' as const }
          : p
      ));

      toast({
        title: 'Request sent!',
        description: 'They will be notified of your interest.',
      });
    } catch (error: any) {
      toast({
        title: 'Error sending request',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAccept = async (peerId: string) => {
    if (!user) return;

    try {
      // Accept the received request
      await supabase
        .from('connection_requests')
        .update({ status: 'accepted' })
        .eq('requester_id', peerId)
        .eq('recipient_id', user.id);

      // Also create/update our request to them as accepted
      const { error } = await supabase
        .from('connection_requests')
        .upsert({
          requester_id: user.id,
          recipient_id: peerId,
          status: 'accepted',
        }, { onConflict: 'requester_id,recipient_id' });

      if (error) throw error;

      // Update local state
      setPeers(prev => prev.map(p => 
        p.userId === peerId 
          ? { ...p, connectionStatus: 'matched' as const }
          : p
      ));

      toast({
        title: "It's a match! 🎉",
        description: 'You can now see their full profile.',
      });
    } catch (error: any) {
      toast({
        title: 'Error accepting request',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Finding peers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      {/* Header */}
      <div className="bg-primary text-white p-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Discover</h1>
          <div className="flex gap-1">
            <NotificationBell />
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        <p className="text-white/80 text-sm text-center">
          Find peers who share your experiences
        </p>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4 pb-24">
        {peers.length === 0 ? (
          <EmptyState />
        ) : (
          peers.map((peer) => (
            <PeerCard
              key={peer.userId}
              peer={peer}
              onConnect={() => handleConnect(peer.userId)}
              onAccept={() => handleAccept(peer.userId)}
            />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
