import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Compass, Clock, CheckCircle, Heart, MessageCircle, Settings, LogOut, Users, ChevronRight, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NotificationBell from '@/components/notifications/NotificationBell';
import BottomNav from '@/components/BottomNav';
import EditProfileModal from '@/components/profile/EditProfileModal';

interface ProfileData {
  firstName: string | null;
  pseudonym: string;
  bio: string | null;
  journeyStage: string | null;
  challenges: string[];
  supportPreferences: string[];
}

const journeyLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  exploring: { label: 'Exploring', icon: <Compass className="w-4 h-4" /> },
  awaiting_diagnosis: { label: 'Awaiting Diagnosis', icon: <Clock className="w-4 h-4" /> },
  post_diagnosis: { label: 'Post-Diagnosis', icon: <CheckCircle className="w-4 h-4" /> },
  supporting_others: { label: 'Supporting Others', icon: <Heart className="w-4 h-4" /> },
};

const supportLabels: Record<string, string> = {
  just_chatting: 'Just Chatting',
  guided_insights: 'Guided Insights',
  peer_support: 'Peer Support',
  professional_resources: 'Professional Resources',
};

const challengeEmojis: Record<string, string> = {
  depression: '😔',
  anxiety: '😰',
  adhd: '⚡',
  grief: '🕊️',
  ptsd: '💔',
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [matchCount, setMatchCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, pseudonym, bio, onboarding_completed')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profileData?.onboarding_completed) {
          navigate('/onboarding');
          return;
        }

        // Fetch journey stage
        const { data: journeyData } = await supabase
          .from('user_journey_stages')
          .select('stage')
          .eq('user_id', user.id)
          .maybeSingle();

        // Fetch challenges
        const { data: challengesData } = await supabase
          .from('user_challenges')
          .select('challenge')
          .eq('user_id', user.id);

        // Fetch support preferences
        const { data: prefsData } = await supabase
          .from('user_support_preferences')
          .select('preference')
          .eq('user_id', user.id);

        // Fetch match count
        const { data: sentRequests } = await supabase
          .from('connection_requests')
          .select('recipient_id')
          .eq('requester_id', user.id)
          .eq('status', 'accepted');

        const { data: receivedRequests } = await supabase
          .from('connection_requests')
          .select('requester_id')
          .eq('recipient_id', user.id)
          .eq('status', 'accepted');

        const sentTo = new Set(sentRequests?.map(r => r.recipient_id) || []);
        const receivedFrom = new Set(receivedRequests?.map(r => r.requester_id) || []);
        const mutualMatches = [...sentTo].filter(id => receivedFrom.has(id));
        setMatchCount(mutualMatches.length);

        setProfile({
          firstName: profileData.first_name,
          pseudonym: profileData.pseudonym,
          bio: profileData.bio,
          journeyStage: journeyData?.stage || null,
          challenges: challengesData?.map(c => c.challenge) || [],
          supportPreferences: prefsData?.map(p => p.preference) || [],
        });
      } catch (error: any) {
        toast({
          title: 'Error loading profile',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate, toast]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!profile) return null;

  const journeyInfo = profile.journeyStage ? journeyLabels[profile.journeyStage] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5 safe-area-inset animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-white p-6 pb-16 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">My Profile</h1>
          <div className="flex gap-1">
            <NotificationBell />
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Avatar & Name */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/40 to-secondary/40 flex items-center justify-center ring-4 ring-white/20">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{profile.pseudonym}</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:bg-white/10 h-8 w-8"
                onClick={() => setEditModalOpen(true)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
            {journeyInfo && (
              <div className="flex items-center gap-2 mt-1 bg-white/10 px-2 py-1 rounded-full w-fit">
                {journeyInfo.icon}
                <span className="text-sm">{journeyInfo.label}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-8 space-y-4 pb-8">
        {/* Matches Card */}
        <Card 
          className="shadow-lg cursor-pointer hover:shadow-xl transition-shadow bg-gradient-to-r from-card to-accent/5 border-accent/20"
          onClick={() => navigate('/matches')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/30 to-secondary/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">My Peers</h3>
                  <p className="text-sm text-accent font-medium">
                    {matchCount} {matchCount === 1 ? 'match' : 'matches'}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Card */}
        {profile.bio && (
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">About Me</h3>
              <p className="text-foreground">{profile.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Challenges */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              What I Relate To
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.challenges.map((challenge) => (
                <Badge
                  key={challenge}
                  variant="secondary"
                  className="px-3 py-1.5 bg-secondary/20 text-foreground"
                >
                  <span className="mr-1">{challengeEmojis[challenge] || '✨'}</span>
                  {challenge.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Preferences */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Looking For
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.supportPreferences.map((pref) => (
                <Badge
                  key={pref}
                  variant="outline"
                  className="px-3 py-1.5 border-accent text-accent"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {supportLabels[pref] || pref}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="text-center text-sm text-muted-foreground mt-6 px-4 pb-20">
          <p>
            🔒 Your personal details (name, email, boundaries) are private and never shown publicly.
          </p>
        </div>
      </div>

      <BottomNav />

      {user && profile && (
        <EditProfileModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          userId={user.id}
          currentData={profile}
          onSave={() => {
            setLoading(true);
            // Re-trigger profile load
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
