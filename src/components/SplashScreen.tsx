import { useEffect, useState } from 'react';
import { MynraLogo } from '@/components/MynraLogo';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 1000 }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 300);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary/90 transition-opacity duration-300 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large slow circle */}
        <div 
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-secondary/10 animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        
        {/* Medium breathing circle */}
        <div 
          className="absolute top-1/4 -right-10 w-60 h-60 rounded-full bg-white/5"
          style={{ 
            animation: 'breathe 3s ease-in-out infinite',
          }}
        />
        
        {/* Small floating circle */}
        <div 
          className="absolute bottom-1/4 left-10 w-40 h-40 rounded-full bg-secondary/15"
          style={{ 
            animation: 'float 3.5s ease-in-out infinite',
          }}
        />
        
        {/* Bottom large circle */}
        <div 
          className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-white/5 animate-pulse"
          style={{ animationDuration: '5s' }}
        />
      </div>

      {/* Center Logo */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div 
          className="relative"
          style={{ 
            animation: 'scaleIn 0.6s ease-out forwards',
          }}
        >
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 w-24 h-24 bg-white/20 rounded-full blur-xl scale-150" />
          
          {/* Logo container with subtle pulse */}
          <div 
            className="relative w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm"
            style={{ 
              animation: 'breathe 2.5s ease-in-out infinite',
            }}
          >
            <MynraLogo size="lg" className="w-14 h-14" />
          </div>
        </div>
        
        {/* App Name */}
        <h1 
          className="text-3xl font-bold text-white tracking-wide"
          style={{ 
            animation: 'fadeInUp 0.6s ease-out 0.2s forwards',
            opacity: 0,
          }}
        >
          Mynra
        </h1>
        
        {/* Tagline */}
        <p 
          className="text-white/70 text-sm"
          style={{ 
            animation: 'fadeInUp 0.6s ease-out 0.4s forwards',
            opacity: 0,
          }}
        >
          You're not alone
        </p>
      </div>

      {/* Inline Keyframes */}
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fadeInUp {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
