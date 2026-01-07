import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <div className={`animate-fade-in ${className}`}>
      {children}
    </div>
  );
}

interface StaggeredItemProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export function StaggeredItem({ children, index, className = '' }: StaggeredItemProps) {
  const delayClass = index <= 5 ? `animate-stagger-${index}` : 'animate-stagger-5';
  
  return (
    <div 
      className={`opacity-0 animate-slide-up ${delayClass} ${className}`}
      style={{ animationFillMode: 'forwards' }}
    >
      {children}
    </div>
  );
}
