import React from 'react';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    /**
     * Image URL to display inside the button (like the examples)
     */
    imageSrc?: string;
    /**
     * Optional explicit width/height class
     */
    className?: string;
    /**
     * If true, the glow will not animate
     */
    isStatic?: boolean;
    /**
     * Color theme for the glow
     */
    gradient?: 'default' | 'rainbow' | 'blue' | 'pink' | 'orange';
}

export function GlowButton({
    children,
    imageSrc,
    className = "",
    isStatic = false,
    gradient = 'default',
    ...props
}: GlowButtonProps) {

    // Define gradient patterns based on the prop
    const getGradient = () => {
        switch (gradient) {
            case 'rainbow':
                // Rainbow is typically a full border
                return `repeating-conic-gradient(from var(--a), 
                    #ff0000 0%, 
                    #ff8000 10%, 
                    #ffff00 20%, 
                    #00ff00 30%, 
                    #00ffff 40%, 
                    #0000ff 50%, 
                    #8000ff 60%, 
                    #ff00ff 70%, 
                    #ff0000 80%
                )`;
            case 'blue':
                // Continuous gradient: Cyan to Dark Blue to Cyan
                return `repeating-conic-gradient(from var(--a), #0ea5e9 0%, #1e3a8a 50%, #0ea5e9 100%)`;
            case 'pink':
                // Continuous gradient: Pink to Deep Pink/Purple to Pink
                return `repeating-conic-gradient(from var(--a), #ec4899 0%, #831843 50%, #ec4899 100%)`;
            case 'orange':
                // Continuous gradient: Orange to Dark Red to Orange
                return `repeating-conic-gradient(from var(--a), #f97316 0%, #7c2d12 50%, #f97316 100%)`;
            case 'default':
            default:
                return `repeating-conic-gradient(from var(--a), #ff2770 0%, #ff2770 5%, transparent 5%, transparent 40%, #ff2770 50%)`;
        }
    };

    const gradientValue = getGradient();
    // Unique keyframe name to prevent collisions if multiple buttons are on page
    const animName = `rot-${gradient}`;

    return (
        <div className={`relative group inline-block ${className}`}>
            {/* 
                This component uses strict CSS capabilities including @property for the angle animation.
                The animation rotates the --a variable from 0deg to 360deg.
             */}
            <style>{`
                @keyframes ${animName} {
                    0% { --a: 0deg; }
                    100% { --a: 360deg; }
                }
                .glow-card-${gradient} {
                    --a: 0deg; /* fallback */
                    position: relative;
                    z-index: 0;
                    overflow: hidden;
                    border-radius: 0.5rem;
                    padding: 2px; /* Border width equivalent */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .glow-card-${gradient}::before {
                    content: '';
                    position: absolute;
                    z-index: -1;
                    inset: -100%; /* Ensure it covers rotation */
                    background: ${gradientValue};
                    animation: ${isStatic ? 'none' : `${animName} 2s linear infinite`};
                }
                /* Second pseudo-element for extra glow layer, optional for some styles but good for 'default' */
                .glow-card-${gradient}::after {
                    content: '';
                    position: absolute;
                    z-index: -1;
                    inset: -100%;
                    background: ${gradientValue};
                    animation: ${isStatic ? 'none' : `${animName} 2s linear infinite`};
                    animation-delay: -0.5s;
                    filter: blur(10px);
                    opacity: 0.7;
                }
                
                /* This is the inner content area */
                .glow-content {
                     background: #1e293b; /* Slate-800 or similar dark bg */
                     border-radius: 0.3rem; /* Slightly smaller than outer */
                     z-index: 1;
                     width: 100%;
                     height: 100%;
                     display: flex;
                     flex-direction: column;
                     justify-content: center;
                     align-items: center;
                     overflow: hidden;
                }
            `}</style>

            <button
                className={`glow-card-${gradient} relative w-full h-full min-w-[150px] min-h-[150px] cursor-pointer active:scale-95 transition-transform`}
                {...props}
            >
                <div className="glow-content p-4 text-white">
                    {imageSrc && (
                        <img
                            src={imageSrc}
                            alt="Button content"
                            className="w-full h-32 object-cover rounded mb-2 opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                    )}
                    {children || (
                        <div className="text-center">
                            <span className="font-bold block">Gradient Glow</span>
                            <span className="text-xs text-gray-400 mt-1 block">
                                {isStatic ? 'Static' : 'Animated'} {gradient}
                            </span>
                        </div>
                    )}
                </div>
            </button>
        </div>
    );
}

export default GlowButton;

{/* <div className="flex flex-row gap-4">
    <GlowButton className="w-64 h-64">
        <div className="flex flex-col items-center">
            <h1>Hello World</h1>
            <p>This is a glowing card</p>
        </div>
    </GlowButton>
    <GlowButton className="w-64 h-64" isStatic gradient="rainbow" />
    <GlowButton className="w-64 h-64" gradient="blue" />
</div> */}
