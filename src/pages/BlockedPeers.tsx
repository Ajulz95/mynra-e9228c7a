import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserX, Users } from 'lucide-react';

export default function BlockedPeers() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [blockedPeers, setBlockedPeers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // TODO: Fetch blocked peers from database
    setIsLoading(false);
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            className="text-foreground hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Blocked Peers</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto">
        {blockedPeers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Blocked Peers</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              You haven't blocked anyone yet. If you ever feel uncomfortable with a peer, 
              you can block them from their profile page.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {blockedPeers.map((peer) => (
              <div
                key={peer.id}
                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <UserX className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-foreground">{peer.pseudonym}</span>
                </div>
                <Button variant="outline" size="sm">
                  Unblock
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
