import { useEffect, useState } from 'react';

const PaperPlane = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start animation after a delay to let the page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none z-10 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Paper Plane with Trail */}
      <div className="paper-plane-container">
        {/* Dotted Trail */}
        <div className="paper-plane-trail">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="trail-dot" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
        
        {/* Paper Plane */}
        <div className="paper-plane-animated">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
          >
            {/* Main plane body */}
            <path
              d="M2 4L28 16L2 28L6 16L2 4Z"
              fill="hsl(var(--accent-red) / 0.8)"
              stroke="hsl(var(--accent-red))"
              strokeWidth="1"
            />
            {/* Wing fold detail */}
            <path
              d="M6 16L14 12L6 16L14 20L6 16Z"
              fill="hsl(var(--accent-red) / 0.6)"
              stroke="hsl(var(--accent-red) / 0.8)"
              strokeWidth="0.5"
            />
            {/* Center crease */}
            <line
              x1="6"
              y1="16"
              x2="28"
              y2="16"
              stroke="hsl(var(--accent-red) / 0.4)"
              strokeWidth="0.5"
            />
            {/* Wing shadows for 3D effect */}
            <path
              d="M6 16L28 16L2 28L6 16Z"
              fill="hsl(var(--accent-red) / 0.3)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export { PaperPlane };