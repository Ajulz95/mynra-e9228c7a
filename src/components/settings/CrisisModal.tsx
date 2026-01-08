import { Phone, ExternalLink, Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CrisisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const crisisResources = [
  {
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    description: '24/7 crisis support',
  },
  {
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: 'Free 24/7 text support',
  },
  {
    name: 'SAMHSA National Helpline',
    phone: '1-800-662-4357',
    description: 'Treatment referral service',
  },
  {
    name: 'International Association for Suicide Prevention',
    phone: null,
    description: 'Find resources worldwide',
    url: 'https://www.iasp.info/resources/Crisis_Centres/',
  },
];

export default function CrisisModal({ open, onOpenChange }: CrisisModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-xl text-foreground">You're Not Alone</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Help is available 24/7
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {crisisResources.map((resource) => (
            <div
              key={resource.name}
              className="p-4 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
            >
              <h4 className="font-semibold text-foreground text-sm">{resource.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
              {resource.phone && (
                <a
                  href={`tel:${resource.phone.replace(/\D/g, '')}`}
                  className="inline-flex items-center gap-2 mt-2 text-primary font-semibold text-sm hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  {resource.phone}
                </a>
              )}
              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 text-primary font-semibold text-sm hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Website
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-secondary/20 border border-secondary/30">
          <p className="text-xs text-muted-foreground text-center">
            If you're in immediate danger, please call your local emergency services (911 in the US).
          </p>
        </div>

        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => onOpenChange(false)}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
