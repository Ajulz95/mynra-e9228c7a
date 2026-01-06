import { useMemo } from 'react';
import { JournalEntry } from '@/pages/Insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MoodTrendsProps {
  entries: JournalEntry[];
}

export default function MoodTrends({ entries }: MoodTrendsProps) {
  const { chartData, trend, averageMood } = useMemo(() => {
    const last14Days = eachDayOfInterval({
      start: subDays(new Date(), 13),
      end: new Date(),
    });

    const dailyMoods = last14Days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayEntries = entries.filter(e => 
        format(new Date(e.created_at), 'yyyy-MM-dd') === dayStr && e.mood
      );
      
      const avgMood = dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + (e.mood || 0), 0) / dayEntries.length
        : null;

      return {
        date: format(day, 'MMM d'),
        mood: avgMood ? Number(avgMood.toFixed(1)) : null,
      };
    });

    // Calculate trend
    const moodsWithData = dailyMoods.filter(d => d.mood !== null);
    let trendDirection: 'up' | 'down' | 'stable' = 'stable';
    
    if (moodsWithData.length >= 3) {
      const recentHalf = moodsWithData.slice(-Math.ceil(moodsWithData.length / 2));
      const olderHalf = moodsWithData.slice(0, Math.floor(moodsWithData.length / 2));
      
      const recentAvg = recentHalf.reduce((s, d) => s + (d.mood || 0), 0) / recentHalf.length;
      const olderAvg = olderHalf.reduce((s, d) => s + (d.mood || 0), 0) / olderHalf.length;
      
      if (recentAvg - olderAvg > 0.3) trendDirection = 'up';
      else if (olderAvg - recentAvg > 0.3) trendDirection = 'down';
    }

    const allMoods = entries.filter(e => e.mood).map(e => e.mood!);
    const avg = allMoods.length > 0 
      ? allMoods.reduce((s, m) => s + m, 0) / allMoods.length 
      : 0;

    return {
      chartData: dailyMoods,
      trend: trendDirection,
      averageMood: avg,
    };
  }, [entries]);

  const entriesWithMood = entries.filter(e => e.mood).length;

  if (entriesWithMood < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-secondary" />
            Mood Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Log a few more moods to see your trends</p>
            <p className="text-xs mt-1">{entriesWithMood}/2 entries with mood</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-secondary" />
            Mood Trends
          </CardTitle>
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-100 text-green-700' :
            trend === 'down' ? 'bg-orange-100 text-orange-700' :
            'bg-muted text-muted-foreground'
          }`}>
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend === 'stable' && <Minus className="w-3 h-3" />}
            <span className="capitalize">{trend}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[1, 5]} 
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={20}
              />
              <Tooltip 
                contentStyle={{ 
                  fontSize: 12,
                  borderRadius: 8,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 0, r: 3 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">
              {averageMood.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">Avg Mood</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-secondary">
              {entriesWithMood}
            </p>
            <p className="text-xs text-muted-foreground">Entries</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
