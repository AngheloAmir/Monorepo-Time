import React from 'react';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 200 200" 
            fill="none" 
            className={className}
        >
            <defs>
                <linearGradient id="logoGradient" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#C084FC" />
                </linearGradient>
                <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Hexagon Background */}
            <path 
                d="M100 20 L170 60 V140 L100 180 L30 140 V60 Z" 
                fill="url(#logoGradient)" 
                fillOpacity="0.15" 
                stroke="url(#logoGradient)" 
                strokeWidth="12" 
                strokeLinejoin="round"
                filter="url(#logoGlow)"
            />

            {/* Inner stylized clock/timer hands */}
            <line x1="100" y1="100" x2="100" y2="55" stroke="white" strokeWidth="10" strokeLinecap="round" />
            <line x1="100" y1="100" x2="140" y2="100" stroke="white" strokeWidth="10" strokeLinecap="round" />
            
            {/* Center pivot */}
            <circle cx="100" cy="100" r="12" fill="white" />

            {/* Orbit/Speed Swoosh */}
            <path d="M160 100 A 60 60 0 0 1 40 100" stroke="url(#logoGradient)" strokeWidth="6" strokeLinecap="round" strokeDasharray="10 10" opacity="0.8" />
        </svg>
    );
};

export default Logo;
