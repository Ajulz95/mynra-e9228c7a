import mynraLogo from '@/assets/mynra-logo.svg';

interface MynraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-9 h-9',
  lg: 'w-12 h-12',
};

export function MynraLogo({ size = 'md', className = '' }: MynraLogoProps) {
  return (
    <img 
      src={mynraLogo} 
      alt="Mynra logo" 
      className={`${sizeMap[size]} ${className}`}
    />
  );
}
