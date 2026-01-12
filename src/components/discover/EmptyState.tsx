import { Users, Heart } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center">
          <Users className="w-12 h-12 text-secondary" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <Heart className="w-5 h-5 text-accent" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-primary mb-2">
        No Peers Yet
      </h3>
      
      <p className="text-muted-foreground max-w-xs">
        You're one of the first here! As more people join Mynra, 
        you'll find peers who share your experiences.
      </p>

      <p className="text-sm text-muted-foreground mt-4 italic">
        Check back soon — your community is growing 💚
      </p>
    </div>
  );
}
