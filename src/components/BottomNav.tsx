import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Users, BookOpen } from 'lucide-react';

const navItems = [
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/discover', label: 'Discover', icon: Users },
  { path: '/insights', label: 'Insights', icon: BookOpen },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 safe-area-inset">
      <div className="flex justify-center gap-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => navigate(item.path)}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-xs ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
