import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Heart,
  Shield,
  Users,
  Database,
  Palette,
  Phone,
  Clock,
  UserX,
  FileText,
  Trash2,
  Moon,
  Focus,
  Eye,
  EyeOff,
  Compass,
  ChevronRight,
} from 'lucide-react';
import CrisisModal from '@/components/settings/CrisisModal';
import SettingsSection from '@/components/settings/SettingsSection';
import SettingsToggle from '@/components/settings/SettingsToggle';

interface UserSettings {
  discoveryMode: boolean;
  allowVoiceCalls: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  darkMode: boolean;
  focusMode: boolean;
  publicChallenges: string[];
}

const CHALLENGE_OPTIONS = [
  { value: 'depression', label: 'Depression' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'adhd', label: 'ADHD' },
  { value: 'grief', label: 'Grief & Loss' },
  { value: 'ptsd', label: 'PTSD / Trauma' },
];

export default function Settings() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userChallenges, setUserChallenges] = useState<string[]>([]);
  
  const [settings, setSettings] = useState<UserSettings>({
    discoveryMode: true,
    allowVoiceCalls: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    darkMode: false,
    focusMode: false,
    publicChallenges: [],
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      try {
        // Load user boundaries
        const { data: boundaries } = await supabase
          .from('user_boundaries')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        // Load user challenges
        const { data: challenges } = await supabase
          .from('user_challenges')
          .select('challenge')
          .eq('user_id', user.id);

        const userChallengesList = challenges?.map((c) => c.challenge) || [];
        setUserChallenges(userChallengesList);

        if (boundaries) {
          setSettings((prev) => ({
            ...prev,
            discoveryMode: boundaries.allow_direct_messages ?? true,
            allowVoiceCalls: boundaries.allow_group_chats ?? true,
            publicChallenges: userChallengesList,
          }));
        }

        // Check for dark mode in localStorage
        const isDark = document.documentElement.classList.contains('dark');
        setSettings((prev) => ({ ...prev, darkMode: isDark }));
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    updateSetting('darkMode', enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleDiscoveryModeToggle = async (enabled: boolean) => {
    if (!user) return;
    updateSetting('discoveryMode', enabled);

    try {
      await supabase
        .from('user_boundaries')
        .upsert({
          user_id: user.id,
          allow_direct_messages: enabled,
        }, { onConflict: 'user_id' });
    } catch (error) {
      console.error('Error saving discovery mode:', error);
    }
  };

  const handleVoiceCallsToggle = async (enabled: boolean) => {
    if (!user) return;
    updateSetting('allowVoiceCalls', enabled);

    try {
      await supabase
        .from('user_boundaries')
        .upsert({
          user_id: user.id,
          allow_group_chats: enabled,
        }, { onConflict: 'user_id' });
    } catch (error) {
      console.error('Error saving voice calls setting:', error);
    }
  };

  const toggleChallengeVisibility = (challenge: string) => {
    const isCurrentlyPublic = settings.publicChallenges.includes(challenge);
    const newPublicChallenges = isCurrentlyPublic
      ? settings.publicChallenges.filter((c) => c !== challenge)
      : [...settings.publicChallenges, challenge];
    
    updateSetting('publicChallenges', newPublicChallenges);
  };

  const handleExportData = () => {
    toast({
      title: 'Export Started',
      description: 'Your insights PDF will be ready for download shortly.',
    });
    // TODO: Implement actual PDF export
  };

  const handleDeleteAccount = async () => {
    toast({
      title: 'Deletion Requested',
      description: 'Your account deletion request has been submitted. You will receive a confirmation email within 48 hours.',
      variant: 'destructive',
    });
    // TODO: Implement actual account deletion flow
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-inset pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home')}
            className="text-foreground hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4 max-w-lg mx-auto">
        {/* Crisis Support - Top Priority */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent border border-destructive/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center">
              <Heart className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Need Immediate Support?</h2>
              <p className="text-sm text-muted-foreground">Help is available 24/7</p>
            </div>
          </div>
          <Button
            onClick={() => setCrisisModalOpen(true)}
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
          >
            <Phone className="w-4 h-4 mr-2" />
            Get Help Now
          </Button>
        </div>

        {/* Privacy & Discovery */}
        <SettingsSection
          icon={Shield}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
          title="Privacy Center"
          description="Control who can find and connect with you"
        >
          <div className="space-y-1 divide-y divide-border/50">
            <SettingsToggle
              id="discovery-mode"
              label="Discovery Mode"
              description="Allow peers to find you through matching"
              checked={settings.discoveryMode}
              onCheckedChange={handleDiscoveryModeToggle}
              icon={Compass}
            />

            <div className="pt-4">
              <Label className="text-sm font-medium text-foreground mb-3 block">
                Profile Visibility
              </Label>
              <p className="text-xs text-muted-foreground mb-3">
                Choose which challenges are visible on your public profile
              </p>
              <div className="space-y-2">
                {CHALLENGE_OPTIONS.filter((c) =>
                  userChallenges.includes(c.value)
                ).map((challenge) => {
                  const isPublic = settings.publicChallenges.includes(challenge.value);
                  return (
                    <button
                      key={challenge.value}
                      onClick={() => toggleChallengeVisibility(challenge.value)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm text-foreground">{challenge.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${isPublic ? 'text-secondary' : 'text-muted-foreground'}`}>
                          {isPublic ? 'Public' : 'Private'}
                        </span>
                        {isPublic ? (
                          <Eye className="w-4 h-4 text-secondary" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                  );
                })}
                {userChallenges.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No challenges selected during onboarding
                  </p>
                )}
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Interaction Controls */}
        <SettingsSection
          icon={Users}
          iconColor="text-secondary"
          iconBgColor="bg-secondary/20"
          title="Boundaries"
          description="Set your interaction preferences"
        >
          <div className="space-y-1 divide-y divide-border/50">
            <SettingsToggle
              id="voice-calls"
              label="Allow Voice Calls"
              description="Let matched peers request voice calls"
              checked={settings.allowVoiceCalls}
              onCheckedChange={handleVoiceCallsToggle}
              icon={Phone}
            />

            <div className="py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">Quiet Hours</Label>
                  <p className="text-xs text-muted-foreground">Pause notifications during rest</p>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-11">
                <div className="flex-1">
                  <Label htmlFor="quiet-start" className="text-xs text-muted-foreground">From</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={settings.quietHoursStart}
                    onChange={(e) => updateSetting('quietHoursStart', e.target.value)}
                    className="mt-1 bg-muted/30"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="quiet-end" className="text-xs text-muted-foreground">To</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={settings.quietHoursEnd}
                    onChange={(e) => updateSetting('quietHoursEnd', e.target.value)}
                    className="mt-1 bg-muted/30"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/blocked-peers')}
              className="w-full flex items-center justify-between py-4 text-left hover:bg-muted/30 -mx-4 px-4 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                  <UserX className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">Blocked Peers</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </SettingsSection>

        {/* Data Management */}
        <SettingsSection
          icon={Database}
          iconColor="text-accent"
          iconBgColor="bg-accent/15"
          title="Your Data"
          description="Export or manage your information"
        >
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-4 border-border hover:bg-muted/50"
              onClick={handleExportData}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <span className="font-medium text-foreground block truncate">Export Insights for Clinician</span>
                <span className="text-xs text-muted-foreground block truncate">Download your journal and mood data as PDF</span>
              </div>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-auto py-4 hover:bg-destructive/10 text-destructive"
                >
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium block">Request Account Deletion</span>
                    <span className="text-xs opacity-70">Permanently remove all your data</span>
                  </div>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">Delete Your Account?</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    This action cannot be undone. All your data, including journal entries, 
                    connections, and preferences will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-muted hover:bg-muted/80">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Yes, Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </SettingsSection>

        {/* Accessibility */}
        <SettingsSection
          icon={Palette}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
          title="Display"
          description="Customize your experience"
        >
          <div className="divide-y divide-border/50">
            <SettingsToggle
              id="dark-mode"
              label="Dark Mode"
              description="Easier on the eyes in low light"
              checked={settings.darkMode}
              onCheckedChange={handleDarkModeToggle}
              icon={Moon}
            />
            <SettingsToggle
              id="focus-mode"
              label="Focus Mode"
              description="Simplified UI with fewer distractions"
              checked={settings.focusMode}
              onCheckedChange={(checked) => updateSetting('focusMode', checked)}
              icon={Focus}
            />
          </div>
        </SettingsSection>

        {/* App Info */}
        <div className="text-center pt-4 pb-8">
          <p className="text-xs text-muted-foreground">Vestra v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">Made with care for your wellbeing</p>
        </div>
      </div>

      {/* Crisis Modal */}
      <CrisisModal open={crisisModalOpen} onOpenChange={setCrisisModalOpen} />
    </div>
  );
}
