import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, MessageCircle, Clock, VolumeX } from 'lucide-react';

interface BoundarySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerId: string;
}

interface PartnerBoundaries {
  allowDirectMessages: boolean;
  preferredResponseTime: string;
  additionalNotes: string | null;
}

export default function BoundarySheet({ open, onOpenChange, partnerId }: BoundarySheetProps) {
  const [partnerBoundaries, setPartnerBoundaries] = useState<PartnerBoundaries | null>(null);
  const [muteConversation, setMuteConversation] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadBoundaries = async () => {
      if (!partnerId) return;

      try {
        const { data, error } = await supabase
          .from('user_boundaries')
          .select('allow_direct_messages, preferred_response_time, additional_notes')
          .eq('user_id', partnerId)
          .maybeSingle();

        if (!error && data) {
          setPartnerBoundaries({
            allowDirectMessages: data.allow_direct_messages,
            preferredResponseTime: data.preferred_response_time,
            additionalNotes: data.additional_notes,
          });
        }
      } catch (error) {
        console.error('Error loading boundaries:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadBoundaries();
    }
  }, [open, partnerId]);

  const responseTimeLabels: Record<string, string> = {
    whenever: 'Responds whenever',
    within_hours: 'Usually responds within hours',
    within_day: 'Usually responds within a day',
    flexible: 'Flexible / No pressure',
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <SheetTitle>Boundaries & Preferences</SheetTitle>
              <SheetDescription>
                Respecting each other's limits
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Their Boundaries */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Their Preferences</h4>
            
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-12 bg-muted rounded-lg" />
                <div className="h-12 bg-muted rounded-lg" />
              </div>
            ) : partnerBoundaries ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {responseTimeLabels[partnerBoundaries.preferredResponseTime] || 'No preference set'}
                  </span>
                </div>

                {partnerBoundaries.additionalNotes && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Note from them:</p>
                    <p className="text-sm">{partnerBoundaries.additionalNotes}</p>
                  </div>
                )}

                {!partnerBoundaries.allowDirectMessages && (
                  <Badge variant="outline" className="text-xs">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Prefers limited messaging
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No specific boundaries set</p>
            )}
          </div>

          {/* Your Controls */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Your Controls</h4>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <VolumeX className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Mute Notifications</p>
                  <p className="text-xs text-muted-foreground">Stop alerts from this chat</p>
                </div>
              </div>
              <Switch
                checked={muteConversation}
                onCheckedChange={setMuteConversation}
              />
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 bg-secondary/10 rounded-lg">
            <p className="text-xs text-secondary font-medium mb-2">💚 Healthy Chat Tips</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• It's okay to take breaks from conversations</li>
              <li>• Respect each other's response times</li>
              <li>• Share only what you're comfortable with</li>
              <li>• Use the report feature if needed</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
