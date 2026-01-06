import { useMemo } from 'react';
import { JournalEntry } from '@/pages/Insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface ThemeCloudProps {
  entries: JournalEntry[];
}

export default function ThemeCloud({ entries }: ThemeCloudProps) {
  const { themes, topWords } = useMemo(() => {
    // Count tags
    const tagCounts: Record<string, number> = {};
    entries.forEach(entry => {
      (entry.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Extract common words from content
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
      'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
      'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
      'it', 'its', 'i', 'my', 'me', 'we', 'our', 'you', 'your', 'he', 'she',
      'his', 'her', 'they', 'their', 'this', 'that', 'these', 'those',
      'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each',
      'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
      'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
      'about', 'also', 'back', 'been', 'before', 'being', 'between', 'come',
      'could', 'day', 'even', 'find', 'first', 'get', 'give', 'go', 'good',
      'him', 'into', 'know', 'last', 'like', 'look', 'make', 'many', 'new',
      'now', 'one', 'out', 'over', 'see', 'take', 'think', 'time', 'two',
      'up', 'use', 'want', 'way', 'well', 'work', 'year', 'quick', 'mood',
      'check', 'feeling', 'today', 'really', 'feel', 'felt', 'lot', 'bit',
      'much', 'still', 'something', 'things', 'thing', 'going', 'doing',
    ]);

    const wordCounts: Record<string, number> = {};
    entries.forEach(entry => {
      const words = entry.content.toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3 && !stopWords.has(w));

      words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
    });

    const sortedWords = Object.entries(wordCounts)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return {
      themes: sortedTags,
      topWords: sortedWords,
    };
  }, [entries]);

  if (themes.length === 0 && topWords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="w-4 h-4 text-accent" />
            Common Themes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">Add tags to your entries to see patterns</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(
    ...themes.map(t => t[1]),
    ...topWords.map(w => w[1])
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Tag className="w-4 h-4 text-accent" />
          Common Themes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {themes.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Your Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {themes.map(([tag, count]) => {
                const size = 0.75 + (count / maxCount) * 0.5;
                return (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-secondary/20"
                    style={{ fontSize: `${size}rem` }}
                  >
                    {tag}
                    <span className="ml-1 opacity-60">×{count}</span>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {topWords.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Recurring Words
            </p>
            <div className="flex flex-wrap gap-2">
              {topWords.map(([word, count]) => (
                <span
                  key={word}
                  className="px-2 py-1 bg-muted rounded-md text-sm text-muted-foreground"
                >
                  {word}
                  <span className="ml-1 opacity-60 text-xs">({count})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground italic text-center pt-2">
          💡 These insights can help you identify patterns to discuss with a therapist
        </p>
      </CardContent>
    </Card>
  );
}
