
import React from 'react';

export const LedgerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 6h10" />
    <path d="M6 12h12" />
    <path d="M4 18h14" />
    <path d="M3 4.5h1" />
    <path d="M3 10.5h1" />
    <path d="M3 16.5h1" />
  </svg>
);
