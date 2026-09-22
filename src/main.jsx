import React from 'react';
import { createRoot } from 'react-dom/client';
import { KageLandingPage } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';
import './portfolio-shell.css';
import { portfolio } from './content.js';

function labelPortfolio(frame) {
  frame.setAttribute('aria-label', portfolio.name + ' — interactive portfolio');
  frame.title = `${portfolio.name} — interactive portfolio`;
}

function Scene() {
  return (
    <main className="shader-frame" aria-label={`${portfolio.name}'s portfolio`}>
      <KageLandingPage
        headingFont="onest"
        bodyFont="onest"
        headingWeight="400"
        bodyWeight="300"
        primaryColor="#e0231c"
        headingSize={46}
        bodySize={17}
        headingLetterSpacing={-0.012}
        applyScene={labelPortfolio}
      />
    </main>
  );
}

createRoot(document.getElementById('app')).render(<Scene />);

