import { useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface GuidedPromptsProps {
  onSelect: (prompt: string) => void;
}

const prompts = [
  {
    category: 'Getting Started',
    items: [
      "Hi! I noticed we share some similar experiences. How are you doing today?",
      "What's been helping you cope lately?",
      "I'm glad we matched! What brought you to Vestra?",
    ]
  },
  {
    category: 'Sharing',
    items: [
      "Something I've learned on my journey is...",
      "Today I'm feeling... How about you?",
      "A small win I had recently was...",
    ]
  },
  {
    category: 'Support',
    items: [
      "I'm here to listen if you'd like to share.",
      "That sounds really tough. How can I support you?",
      "You're not alone in this. 💚",
    ]
  },
  {
    category: 'Boundaries',
    items: [
      "I'm having a low-energy day, so I might respond slowly.",
      "Let me know if there are topics you'd prefer we avoid.",
      "I appreciate you being patient with me.",
    ]
  }
];

export default function GuidedPrompts({ onSelect }: GuidedPromptsProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-border bg-secondary/5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 flex items-center gap-2 text-sm text-secondary hover:bg-secondary/10 transition-colors"
      >
        <Lightbulb className="w-4 h-4" />
        <span className="font-medium">Conversation Starters</span>
        <span className="text-xs text-muted-foreground ml-auto">
          {expanded ? 'Tap to hide' : 'Tap for ideas'}
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-3 space-y-3">
          {prompts.map((category) => (
            <div key={category.category}>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {category.category}
              </p>
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-2 pb-2">
                  {category.items.map((prompt, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="whitespace-normal text-left h-auto py-2 px-3 text-xs max-w-[200px]"
                      onClick={() => {
                        onSelect(prompt);
                        setExpanded(false);
                      }}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
