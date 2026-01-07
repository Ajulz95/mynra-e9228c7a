import { useNavigate } from 'react-router-dom';
import { PeerProfile } from '@/pages/Discover';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Compass, 
  Clock, 
  CheckCircle, 
  Heart, 
  Send, 
  Check, 
  Hourglass,
  Sparkles,
  Lock,
  MessageCircle
} from 'lucide-react';

interface PeerCardProps {
  peer: PeerProfile;
  onConnect: () => void;
  onAccept: () => void;
}

const journeyLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  exploring: { label: 'Exploring', icon: <Compass className="w-3 h-3" /> },
  awaiting_diagnosis: { label: 'Awaiting Diagnosis', icon: <Clock className="w-3 h-3" /> },
  post_diagnosis: { label: 'Post-Diagnosis', icon: <CheckCircle className="w-3 h-3" /> },
  supporting_others: { label: 'Supporting Others', icon: <Heart className="w-3 h-3" /> },
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

export default function PeerCard({ peer, onConnect, onAccept }: PeerCardProps) {
  const navigate = useNavigate();
  const isMatched = peer.connectionStatus === 'matched';
  const isPendingSent = peer.connectionStatus === 'pending_sent';
  const isPendingReceived = peer.connectionStatus === 'pending_received';
  const isAwaiting = peer.connectionStatus === 'awaiting_match';

  const journeyInfo = peer.journeyStage ? journeyLabels[peer.journeyStage] : null;

  // Only show full details if matched
  const displayName = isMatched ? peer.pseudonym : '???';
  const displayBio = isMatched ? peer.bio : null;

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
      peer.sharedChallenges.length > 0 ? 'border-secondary/50' : 'border-border'
    }`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isMatched ? 'bg-accent/20' : 'bg-muted'
            }`}>
              {isMatched ? (
                <User className="w-6 h-6 text-accent" />
              ) : (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className={`font-semibold ${isMatched ? 'text-foreground' : 'text-muted-foreground'}`}>
                {displayName}
              </h3>
              {journeyInfo && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {journeyInfo.icon}
                  <span>{journeyInfo.label}</span>
                </div>
              )}
            </div>
          </div>

          {/* Match indicator */}
          {isMatched && (
            <Badge className="bg-accent text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Matched
            </Badge>
          )}
        </div>

        {/* Shared challenges highlight */}
        {peer.sharedChallenges.length > 0 && (
          <div className="mb-3 p-2 bg-secondary/10 rounded-lg">
            <p className="text-xs font-medium text-primary mb-2">
              🤝 {peer.sharedChallenges.length} shared {peer.sharedChallenges.length === 1 ? 'experience' : 'experiences'}
            </p>
            <div className="flex flex-wrap gap-1">
              {peer.sharedChallenges.map((challenge) => (
                <Badge
                  key={challenge}
                  variant="secondary"
                  className="text-xs bg-secondary/20"
                >
                  {challengeEmojis[challenge] || '✨'} {challenge.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* All challenges (only visible if matched or has few shared) */}
        {peer.challenges.length > peer.sharedChallenges.length && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-2">Also relates to:</p>
            <div className="flex flex-wrap gap-1">
              {peer.challenges
                .filter(c => !peer.sharedChallenges.includes(c))
                .slice(0, 4)
                .map((challenge) => (
                  <Badge
                    key={challenge}
                    variant="outline"
                    className="text-xs"
                  >
                    {challengeEmojis[challenge] || '✨'} {challenge.replace(/_/g, ' ')}
                  </Badge>
                ))}
              {peer.challenges.length - peer.sharedChallenges.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{peer.challenges.length - peer.sharedChallenges.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Bio - only if matched */}
        {displayBio && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {displayBio}
          </p>
        )}

        {/* Privacy notice for non-matched */}
        {!isMatched && (
          <p className="text-xs text-muted-foreground mb-4 italic">
            🔒 Name and bio revealed after mutual match
          </p>
        )}

        {/* Action Button */}
        <div className="flex gap-2">
          {peer.connectionStatus === 'none' && (
            <Button
              onClick={onConnect}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4 mr-2" />
              Request to Connect
            </Button>
          )}

          {isPendingSent && (
            <Button
              disabled
              variant="outline"
              className="flex-1"
            >
              <Hourglass className="w-4 h-4 mr-2" />
              Request Sent
            </Button>
          )}

          {isPendingReceived && (
            <Button
              onClick={onAccept}
              className="flex-1 bg-accent hover:bg-accent/90 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Accept & Match
            </Button>
          )}

          {isAwaiting && (
            <Button
              disabled
              variant="outline"
              className="flex-1"
            >
              <Hourglass className="w-4 h-4 mr-2" />
              Awaiting Their Response
            </Button>
          )}

          {isMatched && (
            <Button
              onClick={() => navigate(`/chat/${peer.userId}`)}
              className="flex-1 bg-accent hover:bg-accent/90 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
