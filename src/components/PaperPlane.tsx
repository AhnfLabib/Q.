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
      {/* Paper Plane */}
      <div className="paper-plane-animated">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-accent/60"
        >
          <path
            d="M2 3L21 12L2 21L5 12L2 3Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export { PaperPlane };