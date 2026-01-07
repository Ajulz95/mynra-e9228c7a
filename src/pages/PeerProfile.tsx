import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Compass, Clock, CheckCircle, Heart, MessageCircle, ArrowLeft, UserPlus, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';

interface PeerProfileData {
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

// Mock data for suggested peers (same as Home.tsx)
const suggestedPeers = [
  {
    id: "1",
    pseudonym: "Calm Lotus",
    matchScore: 92,
    tags: ["Anxiety", "Mindfulness", "Creative"],
    avatarColor: "bg-secondary",
    bio: "Finding peace through mindfulness and creative expression. Here to listen and share.",
  },
  {
    id: "2",
    pseudonym: "Quiet Storm",
    matchScore: 87,
    tags: ["Depression", "Journaling", "Nature"],
    avatarColor: "bg-primary/60",
    bio: "Nature lover and journal keeper. Believe in the healing power of words.",
  },
  {
    id: "3",
    pseudonym: "Gentle Wave",
    matchScore: 85,
    tags: ["ADHD", "Meditation", "Art"],
    avatarColor: "bg-accent/70",
    bio: "Artist with ADHD. Meditation helps me focus. Love connecting with creative souls.",
  },
  {
    id: "4",
    pseudonym: "Soft Cloud",
    matchScore: 81,
    tags: ["Stress", "Yoga", "Reading"],
    avatarColor: "bg-muted-foreground/40",
    bio: "Yoga enthusiast and bookworm. Stress management is my ongoing journey.",
  },
];

export default function PeerProfile() {
  const { peerId } = useParams<{ peerId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [peerData, setPeerData] = useState<typeof suggestedPeers[0] | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected'>('none');
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // For now, use mock data based on peerId
    const peer = suggestedPeers.find(p => p.id === peerId);
    if (peer) {
      setPeerData(peer);
    }
    setLoading(false);
  }, [peerId]);

  const handleConnect = async () => {
    if (!user || !peerId || connectionStatus !== 'none') return;
    
    setSendingRequest(true);
    
    try {
      // For mock peers, we'll just update the local state
      // In production, this would send to the database with real user IDs
      
      // Simulate a slight delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setConnectionStatus('pending');
      toast({
        title: 'Connection request sent!',
        description: `You've sent a connection request to ${peerData?.pseudonym}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error sending request',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSendingRequest(false);
    }
  };

  const handleMessage = () => {
    if (peerData) {
      navigate(`/chat/${peerData.id}`);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!peerData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <p className="text-muted-foreground mb-4">Peer not found</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-inset animate-fade-in">
      {/* Header */}
      <div className="bg-primary text-white p-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Peer Profile</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Avatar & Name */}
        <div className="flex items-center gap-4">
          <div className={`w-20 h-20 rounded-full ${peerData.avatarColor} flex items-center justify-center`}>
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{peerData.pseudonym}</h2>
            <p className="text-white/80 text-sm mt-1">{peerData.matchScore}% Match</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-8 space-y-4 pb-8">
        {/* Action Buttons */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Button 
                className={`flex-1 ${connectionStatus === 'pending' ? 'bg-muted text-muted-foreground' : 'bg-primary hover:bg-primary/90'}`}
                onClick={handleConnect}
                disabled={connectionStatus !== 'none' || sendingRequest}
              >
                {sendingRequest ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : connectionStatus === 'pending' ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Request Sent
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleMessage}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bio Card */}
        {peerData.bio && (
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">About</h3>
              <p className="text-foreground">{peerData.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Interests/Tags */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {peerData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1.5 bg-secondary/20 text-foreground"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="text-center text-sm text-muted-foreground mt-6 px-4 pb-20">
          <p>
            🔒 Personal details are only shared after mutual connection.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
