import { JournalEntry } from '@/pages/Insights';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { MoreVertical, Trash2, Edit, Smile, Meh, Frown, BookOpen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface JournalListProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entryId: string) => void;
}

const getMoodIcon = (mood: number | null) => {
  if (!mood) return null;
  if (mood <= 2) return <Frown className="w-4 h-4 text-orange-400" />;
  if (mood === 3) return <Meh className="w-4 h-4 text-yellow-400" />;
  return <Smile className="w-4 h-4 text-green-400" />;
};

export default function JournalList({ entries, onEdit, onDelete }: JournalListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-secondary" />
        </div>
        <h3 className="font-medium text-foreground mb-1">No entries yet</h3>
        <p className="text-sm text-muted-foreground">
          Start your reflection journey today
        </p>
      </div>
    );
  }

  // Group entries by date
  const groupedEntries = entries.reduce((groups, entry) => {
    const date = format(new Date(entry.created_at), 'yyyy-MM-dd');
    if (!groups[date]) groups[date] = [];
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, JournalEntry[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedEntries).map(([date, dayEntries]) => (
        <div key={date}>
          <p className="text-xs font-medium text-muted-foreground mb-2 px-1">
            {format(new Date(date), 'EEEE, MMMM d')}
          </p>
          <div className="space-y-2">
            {dayEntries.map((entry) => (
              <Card key={entry.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getMoodIcon(entry.mood)}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(entry.created_at), 'h:mm a')}
                        </span>
                      </div>
                      
                      {entry.title && (
                        <h4 className="font-medium text-foreground mb-1 truncate">
                          {entry.title}
                        </h4>
                      )}
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {entry.content}
                      </p>

                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entry.tags.slice(0, 3).map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="secondary" 
                              className="text-xs bg-secondary/20"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {entry.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-secondary/20">
                              +{entry.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(entry)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(entry.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
