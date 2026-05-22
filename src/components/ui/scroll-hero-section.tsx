'use client';

import { useEffect } from 'react';

type Theme = 'system' | 'light' | 'dark';

export type ShipStickyHeaderProps = {
  /** Words that cycle under “you can …” */
  items?: string[];
  /** Sets CSS var --count automatically from items length */
  showFooter?: boolean;
  /** UI theme (affects color-scheme + switch color) */
  theme?: Theme;
  /** Enable view-timeline animations if supported */
  animate?: boolean;
  /** Accent hue (0–359) */
  hue?: number;
  /** Where the highlight band starts (vh) */
  startVh?: number; // default 50
  /** Space (vh) below the sticky header block */
  spaceVh?: number; // default 50
  /** Debug outline (for dev) */
  debug?: boolean;
  /** Optional custom intro text under the header */
  taglineHTML?: string; // allows <br />
};

function WordHeroPage({
  items = ['design.', 'prototype.', 'solve.', 'build.', 'develop.', 'cook.', 'ship.'],
  showFooter = true,
  theme = 'system',
  animate = true,
  hue = 280,
  startVh = 50,
  spaceVh = 50,
  debug = false,
  taglineHTML = `and we&apos;ll show you how.<br /><a href="/contact">Get Started</a>.`,
}: ShipStickyHeaderProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.animate = String(animate);
    root.dataset.debug = String(debug);
    root.style.setProperty('--hue', String(hue));
    root.style.setProperty('--start', `${startVh}vh`);
    root.style.setProperty('--space', `${spaceVh}vh`);
  }, [theme, animate, debug, hue, startVh, spaceVh]);

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={
        {
          // keep count in sync with CSS sticky offset math
          ['--count' as any]: items.length,
        } as React.CSSProperties
      }
    >
      <header className="content-header fluid">
        <section className="content-section">
          <h1 className="sr-only sm:not-sr-only">
            <span aria-hidden="true">you can&nbsp;</span>
            <span className="sr-only">you can build things.</span>
          </h1>

          {/* Visible cycling words (aria-hidden) */}
          <ul aria-hidden="true">
            {items.map((word, i) => (
              <li key={i} style={{ ['--i' as any]: i } as React.CSSProperties}>
                {word}
              </li>
            ))}
          </ul>
        </section>
      </header>

      <main className="word-hero-main">
        <section>
          <p
            className="fluid tagline-text"
            dangerouslySetInnerHTML={{ __html: taglineHTML }}
          />
        </section>
      </main>

      {showFooter && <footer className="word-hero-footer">WebForYou &copy; 2025</footer>}

      <style jsx global>{`
        @layer base, stick, demo, debug;

        :root {
          --start: 50vh;
          --space: 50vh;
          --hue: 280;
          --accent: light-dark(hsl(var(--hue) 100% 50%), hsl(var(--hue) 90% 75%));
          --switch: canvas;
          --font-size-min: 14;
          --font-size-max: 20;
          --font-ratio-min: 1.1;
          --font-ratio-max: 1.33;
          --font-width-min: 375;
          --font-width-max: 1500;
        }
        [data-theme='dark'] { --switch: #000; color-scheme: dark only; }
        [data-theme='light'] { --switch: #fff; color-scheme: light only; }
        
        .sr-only {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
        }
        .fluid {
          --fluid-min: calc(var(--font-size-min) * pow(var(--font-ratio-min), var(--font-level, 0)));
          --fluid-max: calc(var(--font-size-max) * pow(var(--font-ratio-max), var(--font-level, 0)));
          --fluid-preferred: calc((var(--fluid-max) - var(--fluid-min)) / (var(--font-width-max) - var(--font-width-min)));
          --fluid-type: clamp(
            (var(--fluid-min) / 16) * 1rem,
            ((var(--fluid-min) / 16) * 1rem)
              - (((var(--fluid-preferred) * var(--font-width-min)) / 16) * 1rem)
              + (var(--fluid-preferred) * var(--variable-unit, 100vi)),
            (var(--fluid-max) / 16) * 1rem
          );
          font-size: var(--fluid-type);
        }

        .content-header {
          --font-level: 4;
          --font-size-min: 24;
          position: sticky;
          top: calc((var(--count) - 1) * -1lh);
          line-height: 1.2;
          display: flex;
          align-items: start;
          width: 100%;
          margin-bottom: var(--space);
          z-index: 1;
        }
        .content-section {
          display: flex; width: 100%;
          align-items: start; justify-content: center;
          padding-top: calc(var(--start) - 0.5lh);
        }
        .content-section h1 {
          position: sticky; top: calc(var(--start) - 0.5lh);
          margin: 0; font-weight: 600;
        }

        ul {
          font-weight: 600; list-style: none; padding: 0; margin: 0;
        }

        li {
          --dimmed: color-mix(in oklch, canvasText, #0000 80%);
          background:
            linear-gradient(
              180deg,
              var(--dimmed) 0 calc(var(--start) - 0.5lh),
              var(--accent) calc(var(--start) - 0.55lh) calc(var(--start) + 0.55lh),
              var(--dimmed) calc(var(--start) + 0.5lh)
            );
          background-attachment: fixed;
          color: #0000;
          background-clip: text;
        }

        .word-hero-main {
          width: 100%; height: 100vh; position: relative; z-index: 2; color: canvas;
        }
        .word-hero-main::before {
          content: ''; position: absolute; inset: 0; z-index: -1;
          background: light-dark(#000, #fff); border-radius: 1rem 1rem 0 0;
        }
        .word-hero-main section {
          --font-level: 4; --font-size-min: 20;
          height: 100%; width: 100%; display: flex; place-items: center; justify-content: center;
        }
        .word-hero-main section p {
          margin: 0; font-weight: 600; text-align: center;
        }
        .word-hero-main section a {
          color: var(--accent); text-decoration: none; text-underline-offset: 0.1lh;
        }
        .word-hero-main section a:is(:hover, :focus-visible) { text-decoration: underline; }

        .word-hero-footer {
          padding-block: 2rem; font-size: 0.875rem; font-weight: 300;
          color: color-mix(in hsl, canvas, #0000 35%); text-align: center; width: 100%;
          background: light-dark(#000, #fff);
        }

        @supports (animation-timeline: view()) {
          [data-animate='true'] .word-hero-main { view-timeline: --section; }
          [data-animate='true'] .word-hero-main::before {
            transform-origin: 50% 100%;
            scale: 0.9;
            animation: grow both ease-in-out;
            animation-timeline: --section;
            animation-range: entry 50%;
          }
          @keyframes reveal { from { opacity: 0; } to { opacity: 1; } }
          @keyframes grow { to { scale: 1; border-radius: 0; } }
        }
      `}</style>
    </div>
  );
}

export {WordHeroPage}
