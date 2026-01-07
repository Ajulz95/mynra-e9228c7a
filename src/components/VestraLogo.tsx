import vestraLogo from '@/assets/vestra-logo.svg';

interface VestraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-9 h-9',
  lg: 'w-12 h-12',
};

export function VestraLogo({ size = 'md', className = '' }: VestraLogoProps) {
  return (
    <img 
      src={vestraLogo} 
      alt="Vestra logo" 
      className={`${sizeMap[size]} ${className}`}
    />
  );
}
