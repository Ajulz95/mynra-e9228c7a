import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, Phone, MoreVertical, Lock, Flag, Shield, Compass, Clock, CheckCircle, Heart } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatHeaderProps {
  partner: {
    pseudonym: string;
    journeyStage: string | null;
  };
  isVoiceCallUnlocked: boolean;
  messagesUntilUnlock: number;
  onBack: () => void;
  onReport: () => void;
  onBoundary: () => void;
}

const journeyIcons: Record<string, React.ReactNode> = {
  exploring: <Compass className="w-3 h-3" />,
  awaiting_diagnosis: <Clock className="w-3 h-3" />,
  post_diagnosis: <CheckCircle className="w-3 h-3" />,
  supporting_others: <Heart className="w-3 h-3" />,
};

export default function ChatHeader({ 
  partner, 
  isVoiceCallUnlocked, 
  messagesUntilUnlock,
  onBack, 
  onReport,
  onBoundary
}: ChatHeaderProps) {
  return (
    <div className="bg-primary text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="font-semibold">{partner.pseudonym}</h1>
            {partner.journeyStage && (
              <div className="flex items-center gap-1 text-xs text-white/70">
                {journeyIcons[partner.journeyStage]}
                <span className="capitalize">{partner.journeyStage.replace('_', ' ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Voice Call Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`text-white ${isVoiceCallUnlocked ? 'hover:bg-white/10' : 'opacity-50 cursor-not-allowed'}`}
                disabled={!isVoiceCallUnlocked}
              >
                {isVoiceCallUnlocked ? (
                  <Phone className="w-5 h-5" />
                ) : (
                  <div className="relative">
                    <Phone className="w-5 h-5" />
                    <Lock className="w-3 h-3 absolute -bottom-1 -right-1 text-white" />
                  </div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isVoiceCallUnlocked 
                ? 'Start voice call' 
                : `Unlocks after ${messagesUntilUnlock} more messages`}
            </TooltipContent>
          </Tooltip>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onBoundary}>
                <Shield className="w-4 h-4 mr-2" />
                Set Boundaries
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onReport} className="text-destructive">
                <Flag className="w-4 h-4 mr-2" />
                Report User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
