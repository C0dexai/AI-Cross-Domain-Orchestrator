
import React from 'react';

export const GeminiIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
        <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#4285F4'}} />
            <stop offset="100%" style={{stopColor: '#9B72F4'}} />
        </linearGradient>
    </defs>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.28 15.46L8 16.5l2.72-2.72-1.44-1.44L6.5 15.12V9.88l2.78 2.78 1.44-1.44L8 8.5v-1l2.72 2.72 1.44-1.44L9.44 6H14.5l-2.78 2.78-1.44 1.44L13.06 13H7.88l2.84 2.84-1.44 1.44z" fill="url(#gemini-gradient)" />
  </svg>
);
