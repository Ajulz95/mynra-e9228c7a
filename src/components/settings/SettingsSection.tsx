import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface SettingsSectionProps {
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function SettingsSection({
  icon: Icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${iconBgColor} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <CardTitle className="text-base text-foreground">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm text-muted-foreground mt-0.5">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
